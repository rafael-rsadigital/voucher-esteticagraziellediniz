import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <img src="/logo-grazielle.jpg" alt="Estética Grazielle Diniz" className="mb-6 h-28 w-28 rounded-full object-cover shadow-lg" />
      <h1 className="mb-2 font-cursive text-4xl text-primary">Estética Grazielle Diniz</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">Guarujá - SP</p>
      <Button onClick={() => navigate("/admin/login")} variant="outline">
        Área Administrativa
      </Button>
    </div>
  );
};

export default Index;
