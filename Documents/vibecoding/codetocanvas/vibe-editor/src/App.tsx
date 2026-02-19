import { TooltipProvider } from '@/components/ui/tooltip';
import { Toolbar } from '@/components/Toolbar';
import { FloatingToolbar } from '@/components/FloatingToolbar';
import { Canvas } from '@/components/Canvas';
import { Inspector } from '@/components/Inspector';
import './App.css';

function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-screen w-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden relative">
          <Canvas />
          <Inspector />
          <FloatingToolbar />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
