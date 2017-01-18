from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db import models
from django.db.models.signals import post_save
from ordered_model.models import OrderedModel
import shortuuid


class UUIDMixin(models.Model):
    uuid = models.CharField(editable=False, db_index=True, max_length=22)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = shortuuid.uuid()
        super().save(*args, **kwargs)


class Board(OrderedModel, UUIDMixin):
    """
    A kanban board. Contains columns.
    """
    order_with_respect_to = 'owner'
    owner = models.ForeignKey(User, related_name='boards')
    name = models.CharField(blank=True, max_length=255)

    def __str__(self):
        return f'{self.owner} → {self.name}'


class Column(OrderedModel, UUIDMixin):
    """
    A column on the kanban board: 'Backlog', 'In Progress', 'Done', etc.
    """
    order_with_respect_to = 'board'
    board = models.ForeignKey(Board, related_name='columns')
    name = models.CharField(blank=True, max_length=255)

    def __str__(self):
        return f'{self.board} → {self.name}'


class Card(OrderedModel, UUIDMixin):
    """
    Represents a task on the kanban board. Can be placed in any position in a
    column, or archived to remove it from the board.
    """
    order_with_respect_to = 'column'
    column = models.ForeignKey(Column, related_name='cards')
    name = models.CharField(blank=True, max_length=255)
    description = models.TextField(blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.column} → {self.name}'


@receiver(post_save, sender=User)
def create_board_for_user(sender, instance, created, **kwargs):
    """
    Create a board for new users when they are created.
    """
    if created:
        instance.boards.create(name='Kanban Board')


@receiver(post_save, sender=Board)
def create_columns_for_board(sender, instance, created, **kwargs):
    """
    Create default columns when a new board is created.
    """
    if created:
        for name in ('Backlog', 'In Progress', 'Done'):
            instance.columns.create(name=name)
