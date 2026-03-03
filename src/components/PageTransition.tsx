import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className={`animate-page-enter ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;
