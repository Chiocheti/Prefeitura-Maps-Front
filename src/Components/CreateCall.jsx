import { useState } from 'react';
import CreateTrash from './CallOptions/CreateTrash';
import './CreateCall.css'

export default function CreateCall({ point: { lat, lng }, reloadTrash }) {

  const [callType, setCallType] = useState(0);

  return (
    <div className='firstFormContainer'>
      <p className='servicesLabel'>Serviço: </p>
      <select className="typeSelect"value={callType} onChange={(e) => setCallType(e.target.value)}>
        <option value={0} disabled>Selecione</option>
        <option value={1}>Recolhimento de Resíduos</option>
        <option value={2}>Calçada quebrada</option>
        <option value={3}>Mato alto</option>
        <option value={4}>Afiação</option>
        <option value={5}>Asfalto</option>
      </select>

      {
        callType === '1' && (
          <CreateTrash lat={lat} lng={lng} reloadTrash={reloadTrash} ></CreateTrash>
        )
      }
    </div>
  )
}