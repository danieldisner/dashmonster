import UserForm from '@/components/dashboard/UserForm';
import { getUser, updateUser } from '@/services/user';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return <UserForm user={user} onSubmit={(data) => updateUser(params.id, data)} />;
}
