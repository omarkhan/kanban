const { Link } = ReactRouter;

function Boards(props) {
  let displayBoard = (board) => (
    <Link to={`board/${board.id}`} className="list-group-item list-group-item-action">{board.name}</Link>
  );

  return (
    <div className="boards container">
      <h2>Boards</h2>
      <hr />
      <div className="list-group">
        {props.boards.map(displayBoard)}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {};
}

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Boards);
