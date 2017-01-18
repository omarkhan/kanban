const { Provider }                  = ReactRedux;
const { Router, Route, IndexRoute } = ReactRouter;

const App    = require('./components/app');
const Boards = require('./components/boards');
const Board  = require('./components/board');

const store = Redux.createStore(app, window.INITIAL_DATA);

function app(state, action) {
  switch (action.type) {
    case 'MOVE_CARD':
      return moveCard(state, action.source, action.target);
    default:
      return state;
  }
}

function moveCard(state, from, to) {
  if (from.cardId === to.cardId) return state;
  let source = find(state, from);
  let target = find(state, to);
  let dup = copyState(state);
  let sourceColumn = dup.boards[source.board].columns[source.column];
  let targetColumn = dup.boards[target.board].columns[target.column];
  let selection = sourceColumn.cards.splice(source.card, 1);
  let insersionPoint = target.card != null ? target.card : targetColumn.cards.length;
  targetColumn.cards.splice(insersionPoint, 0, ...selection);
  return dup;
}

// TODO: optimize
function find(state, { columnId, cardId }) {
  for (let i = 0; i < state.boards.length; i++) {
    let board = state.boards[i];
    for (let j = 0; j < board.columns.length; j++) {
      let column = board.columns[j];
      if (columnId != null && column.id === columnId) {
        return { board: i, column: j };
      } else if (cardId != null) {
        for (let k = 0; k < column.cards.length; k++) {
          let card = column.cards[k];
          if (card.id === cardId) {
            return { board: i, column: j, card: k };
          }
        }
      }
    }
  }
}

function copyState(state) {
  return JSON.parse(JSON.stringify(state));
}

ReactDOM.render((
  <Provider store={store}>
    <Router history={ReactRouter.browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Boards} />
        <Route path="board/:boardId" component={Board} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));
