import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import HomeIconOneMenu from '../img-jsx/HomeIconOneMenu';
import HomeIconTwoMenu from '../img-jsx/HomeIconTwoMenu';
import FriendsIconOneMenu from '../img-jsx/FriendsIconMenu';
import FriendsIconTwoMenu from '../img-jsx/FriendsIconTwoMenu';
import TasksIconOneMenu from '../img-jsx/TasksIconMenu';
import TasksIconTwoMenu from '../img-jsx/TasksIconTwoMenu';
import ProfileOne from '../img-jsx/ProfileOne';
import ProfileTwo from '../img-jsx/ProfileTwo';
import GiftTwo from '../img-jsx/GiftTwo';
import GiftOne from '../img-jsx/GiftOne';

const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleClick = (path) => (event) => {
    if (currentPath === path) {
      event.preventDefault(); 
    }
  };

  return (
      <div className="menu">
        <div className={`menu-item ${currentPath === '/' ? 'active' : ''}`}>
          <Link to="/" onClick={handleClick('/')}>
            {currentPath === '/' ? <HomeIconTwoMenu /> : <HomeIconOneMenu />}
            <span className="Name">
              Slots
            </span>
          </Link>
        </div>
         <div className={`menu-item ${currentPath === '/gifts' ? 'active' : ''}`}>
          <Link to="/gifts" onClick={handleClick('/gifts')}>
            {currentPath === '/gifts' ? <GiftTwo /> : <GiftOne />}
            <span className="Name">
              Gifts
            </span>
          </Link>
        </div>
        <div className={`menu-item ${currentPath === '/friends' ? 'active' : ''}`}>
          <Link to="/friends" onClick={handleClick('/friends')}>
              {currentPath === '/friends' ? <FriendsIconTwoMenu /> :  <FriendsIconOneMenu />}
              <span className="Name">
                Friens
              </span>
          </Link>
        </div>
        <div className={`menu-item ${currentPath === '/tasks' ? 'active' : ''}`}>
          <Link to="/tasks" onClick={handleClick('/tasks')}>
            {currentPath === '/tasks' ? <TasksIconTwoMenu /> : <TasksIconOneMenu />}
            <span className="Name">
              Tasks
            </span>
          </Link>
        </div>
        <div className={`menu-item ${currentPath === '/profile' ? 'active' : ''}`}>
          <Link to="/profile" onClick={handleClick('/profile')}>
            {currentPath === '/profile' ? <ProfileTwo /> : <ProfileOne />}
            <span className="Name">
              You
            </span>
          </Link>
        </div>
      </div>
  );
};

export default Menu;