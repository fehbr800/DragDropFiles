import Draggable from "react-draggable";



export default function DraggableSignature({ url, onEnd, onSet, onCancel }) {
  const styles = {
    container: {
      position: 'absolute',
      zIndex: 100000,
      border: `2px solid ${primary45}`,
    },
    controls: {
      position: 'absolute',
      right: 0,
      display: 'inline-block',
      backgroundColor: primary45,
      // borderRadius: 4,
    },
    smallButton: {
      display: 'inline-block',
      cursor: 'pointer',
      padding: 4,
    }
  }
  return (
    <Draggable onStop={onEnd}>
      <div style={styles.container}>
        <div style={styles.controls}>
          <div style={styles.smallButton} onClick={onSet}>Confirmar</div>
          <div style={styles.smallButton} onClick={onCancel}>Cancel</div>
        </div>
        <img src={url} width={200} style={styles.img} draggable={false} />
      </div>
    </Draggable>
  );
}
