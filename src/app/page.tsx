import Header from '@/components/scoutsafe/Header';
import Dashboard from '@/components/scoutsafe/Dashboard';
import { ScoutSafeProvider } from '@/contexts/ScoutSafeContext';

export default function Home() {
  return (
    <ScoutSafeProvider>
      <div className="flex min-h-screen w-full flex-col bg-background print-container">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Dashboard />
        </main>
      </div>
    </ScoutSafeProvider>
  );
}
