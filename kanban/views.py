import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def index(request):
    boards = request.user.boards.all().prefetch_related('columns__cards')
    return render(request, 'kanban/index.html', {
        'initial_data': json.dumps({
            'boards': [_serialize_board(board) for board in boards]
        }),
    })


def _serialize_board(board):
    return {
        'id': board.uuid,
        'name': board.name,
        'columns': [_serialize_column(column) for column in board.columns.all()]
    }


def _serialize_column(column):
    return {
        'id': column.uuid,
        'name': column.name,
        'cards': [_serialize_card(card) for card in column.cards.all()],
    }


def _serialize_card(card):
    return {
        'id': card.uuid,
        'name': card.name,
        'description': card.description,
    }
