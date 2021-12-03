import axios from '@/services/axios';

export async function users() {
    const { data } = await axios.get('/api/users?page=2');
    return data;
}
