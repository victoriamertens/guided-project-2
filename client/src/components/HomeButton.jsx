import { Link } from 'react-router-dom';

const HomeButton = () => {
  return (
    <Link to="/" className="home-button">
      <span className="home-icon">🏠</span>
    </Link>
  );
};

export default HomeButton;
