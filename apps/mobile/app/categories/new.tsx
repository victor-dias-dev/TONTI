import { useLocalSearchParams } from 'expo-router';
import { CategoryFormScreen } from '../../src/features/categories/screens/CategoryFormScreen';

export default function NewCategoryRoute() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  return <CategoryFormScreen type={type === 'income' ? 'income' : 'expense'} />;
}
