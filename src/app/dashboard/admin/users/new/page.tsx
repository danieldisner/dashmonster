import UserForm from '@/components/dashboard/UserForm';
import { createUser } from '@/services/user';

export default function NewUserPage() {
  return <UserForm onSubmit={createUser} />;
}
