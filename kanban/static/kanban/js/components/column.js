const { DropTarget } = ReactDnD;

const Card = require('./card');

const columnTarget = {
  drop(props, monitor) {
    if (monitor.didDrop()) return;
    return { columnId: props.id };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

function Column(props) {
  let classes = ['column', 'card'];
  if (props.isOver) classes.push('over');
  return props.connectDropTarget(
    <div className={classes.join(' ')}>
      <div className="card-header">
        {props.name}
      </div>
      <div className="card-block cards">
        {props.cards.map((card) => <Card key={card.id} id={card.id} name={card.name} description={card.description} moveCard={props.moveCard} />)}
      </div>
    </div>
  );
}

module.exports = DropTarget('card', columnTarget, collect)(Column);
