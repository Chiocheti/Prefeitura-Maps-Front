import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import moment from 'moment';

import { api } from '../services/api';

const schema = Yup.object({
  service: Yup.string('').required('Campo Obrigatório'),
  priority: Yup.number().typeError('Seleciona a prioridade').required('Campo Obrigatório'),
})


export default function CreateCall({ find: { lat, lng }, findCalls }) {

  const { handleSubmit, register, formState: { errors }, } = useForm({
    resolver: yupResolver(schema)
  })

  async function createCall(data) {
    console.log(data);
    const call = {
      ...data,
      lat,
      lng,
      status: 'Aberto',
      date: moment().format('YYYY-MM-DD'),
    }
    try {
      const { data } = await api.post('/calls/create', { call });

      console.log(data);
      findCalls({ lat, lng });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(createCall)}>
      <label htmlFor="service">Serviço</label>
      <select {...register("service")}>
        <option value="" disabled>Selecione</option>
        <option value={'Corte de Arvore'}>Corte de Arvore</option>
        <option value={'Calçada quebrada'}>Calçada quebrada</option>
        <option value={'Mato alto'}>Mato alto</option>
        <option value={'Afiação'}>Afiação</option>
        <option value={'Asfalto'}>Asfalto</option>
      </select>
      <p style={{ color: "red" }}>{errors.service?.message}</p>

      <label htmlFor="priority">Prioridade</label>
      <input type="number" max={10} min={1} {...register('priority')} />
      <p style={{ color: "red" }}>{errors.priority?.message}</p>

      <button type='submit'>
        CADASTRAR
      </button>
    </form>
  )
}