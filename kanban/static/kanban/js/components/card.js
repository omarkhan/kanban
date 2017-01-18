const { DragSource, DropTarget } = ReactDnD;

const cardSource = {
  beginDrag(props) {
    return { cardId: props.id };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) return;
    const source = monitor.getItem();
    const target = monitor.getDropResult();
    props.moveCard(source, target);
  }
};

const cardTarget = {
  drop(props) {
    return { cardId: props.id };
  }
};

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function collectDropTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

function Card(props) {
  let classes = ['card'];
  if (props.isDragging) classes.push('dragging');
  if (props.isOver) classes.push('over');
  return props.connectDragSource(props.connectDropTarget(
    <div className={classes.join(' ')}>
      <div className="card-header">
        {props.name}
      </div>
      <div className="card-block">
        {props.description}
      </div>
    </div>
  ));
}

module.exports = (
  DragSource('card', cardSource, collectDragSource)(
    DropTarget('card', cardTarget, collectDropTarget)(
      Card))
);
