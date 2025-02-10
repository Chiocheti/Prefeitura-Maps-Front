import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { api } from '../../services/api';

const schema = Yup.object({
  priority: Yup.number().typeError('Seleciona a prioridade').required('Campo Obrigatório'),
  type: Yup.string().required('Campo Obrigatório'),
  lastClean: Yup.string().required('Campo Obrigatório'),
})

export default function CreateTrash({ lat, lng, reloadTrash }) {

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  })

  async function createTrash(data) {
    const trash = {
      ...data,
      lat,
      lng,
      status: 'Aberto',
      date: moment().format('YYYY-MM-DD'),
    }
    try {
      await api.post('/trash/create', { trash });
      console.log('Reloded');

      reloadTrash();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(createTrash)}>
      <label htmlFor="priority">Prioridade: </label>
      <select {...register("priority")}>
        <option value="" disabled>Selecione</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>

      </select>
      <p style={{ color: "red" }}>{errors.priority?.message}</p>

      <label htmlFor="priority">Tipo de resíduos: </label>
      <input type="text" {...register('type')} />
      <p style={{ color: "red" }}>{errors.type?.message}</p>

      <label htmlFor="priority">Ultima Limpeza: </label>
      <input type="date" {...register('lastClean')} />
      <p style={{ color: "red" }}>{errors.lastClean?.message}</p>

      <button type='submit' style={{ backgroundColor: 'black', color: 'white' }}>
        CADASTRAR
      </button>
    </form>
  )
}