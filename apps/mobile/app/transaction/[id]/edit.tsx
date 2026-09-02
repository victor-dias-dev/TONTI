import { useLocalSearchParams } from 'expo-router';
import { NewTransactionScreen } from '../../../src/features/transactions/screens/NewTransactionScreen';

export default function EditTransactionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <NewTransactionScreen transactionId={id} />;
}
