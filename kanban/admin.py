from django.contrib import admin
from ordered_model.admin import OrderedModelAdmin

from kanban.models import Board, Column, Card


class ColumnInline(admin.StackedInline):
    model = Column
    extra = 1
    show_change_link = True


class CardInline(admin.StackedInline):
    model = Card
    extra = 1


@admin.register(Board)
class BoardAdmin(OrderedModelAdmin):
    list_display = ['__str__', 'move_up_down_links']
    inlines = [ColumnInline]


@admin.register(Column)
class ColumnAdmin(OrderedModelAdmin):
    list_display = ['__str__', 'move_up_down_links']
    inlines = [CardInline]


@admin.register(Card)
class CardAdmin(OrderedModelAdmin):
    list_display = ['__str__', 'move_up_down_links']
