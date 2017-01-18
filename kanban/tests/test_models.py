from django.contrib.auth.models import User
from django.test import TestCase


class ModelsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='test', password='pass')

    def test_board_created_for_new_user(self):
        self.user.save()
        self.assertEqual(self.user.boards.count(), 1)

    def test_columns_created_for_new_board(self):
        board = self.user.boards.get()
        board.save()
        self.assertEqual(
            list(board.columns.values_list('name', flat=True)),
            ['Backlog', 'In Progress', 'Done']
        )
