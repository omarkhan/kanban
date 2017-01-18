const { Link }            = ReactRouter;
const { DragDropContext } = ReactDnD;

const Column = require('./column');

function Board(props) {
  return (
    <div className="board card">
      <div className="card-header">
        {props.board.name}
      </div>
      <div className="card-block columns">
        {props.board.columns.map((column) => <Column key={column.id} id={column.id} name={column.name} cards={column.cards} moveCard={props.moveCard} />)}
      </div>
    </div>
  );
}

function mapStateToProps(state, props) {
  return {
    board: state.boards.find((board) => board.id === props.params.boardId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    moveCard: (source, target) => {
      dispatch({ type: 'MOVE_CARD', source: source, target: target });
    }
  };
}

module.exports = DragDropContext(ReactDnDHTML5Backend)(ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Board));
