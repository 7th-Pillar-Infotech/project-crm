import { AppLayout } from '@/components/layout/AppLayout';

export default function FeatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
