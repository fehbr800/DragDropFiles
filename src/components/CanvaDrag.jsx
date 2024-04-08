
import { useEffect, useState } from "react";
import { DndContext, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';

import { Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'


export const SignatureForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4(); 
    onSubmit({ id, name, email }); 
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl p-4 bg-white border border-gray-400 rounded-md shadow-md">
      <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
      <button type="submit" className="block w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"> Adicionar Assinatura </button>
    </form>
  );
};


export const SignatoriesList = ({ signatories, setSignatures }) => {

  const handleRemoveSignatory = (index) => {
    const updatedSignatories = [...signatories];
    updatedSignatories.splice(index, 1);
    setSignatures(updatedSignatories);
  };

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Signatários Adicionados:</h2>
  
  <Droppable droppableId="signatories">
    {(provided) => (
      <ul
        className="flex flex-col w-full p-2 rounded shadow-lg"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {signatories.map((signatory, index) => (
          <Draggable key={index} draggableId={`signatory-${index}`} index={index}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="flex items-center justify-between p-2 mb-2 border-2 border-dashed cursor-move"
              >
                <span className="font-bold">{signatory.name}</span> - {signatory.email}
                <button onClick={() => handleRemoveSignatory(index)} className="text-red-500">
                  Remover
                </button>
              </li>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
    </div>
  );
};


export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Assinatura 1', position: { x: 0, y: 0 } },
    { id: 2, name: 'Assinatura 2', position: { x: 100, y: 0 } },
    { id: 3, name: 'Assinatura 3', position: { x: 200, y: 0 } }
  ]);
  
  const handleDrop = (event) => {
    const subscriptionId = event?.data?.current?.draggable?.id;
    if (subscriptionId) {
      onDrop(subscriptionId);
    }
  };

  return (
    <DndContext>
      <PositionedSubscription onDrop={handleDrop}>
        <SortableContext items={subscriptions}>
          <ul>
            {subscriptions.map(subscription => (
              <Subscription
                key={subscription.id}
                subscription={subscription}
                onDrop={handleDrop}
                style={{
                  position: 'absolute',
                  left: `${subscription.position.x}px`,
                  top: `${subscription.position.y}px`
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </PositionedSubscription>
    </DndContext>
  );
} 

function Subscription({ subscription, onDrop }) {
  const { attributes, listeners, isDragging, setNodeRef, transform } = useDraggable({
    id: subscription.id
  });

  const handleDragEnd = () => {
    if (isDragging) {
      onDrop(subscription.id);
    }
  };

  return (
    <li
    className="absolute z-50 bg-black"
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
      }}
      {...attributes}
      {...listeners}
      onDragEnd={handleDragEnd}
    >
      {subscription.name}
    </li>
  );
}

export default Subscription;




function PositionedSubscription({ onDrop }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'positioned-subscription'
  });

  const handleDrop = (event) => {
    const subscriptionId = event.data.current.draggable.id;
    onDrop(subscriptionId);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '300px',
        height: '300px',
        border: '2px dashed #ccc',
        position: 'relative',
        zIndex:10
      }}
      onDrop={(event) => handleDrop(event)}
      onDragOver={(event) => event.preventDefault()}
    >
      {isOver && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.1)' }} />}
    </div>
  );
}


