import { NavLink } from "react-router-dom";

import './PageHeader.css'

export const PageHeader = () => {
  return (
    <div className="header_background">
      <div className="header_box">
        <h3 className="header_title">MealHunt</h3>
        <div className="header_linkbox">
          <NavLink className={({isActive}) => (isActive ? 'header_active_link' : 'header_link')} to={'/'}>Random Meal</NavLink>
          <NavLink className={({isActive}) => (isActive ? 'header_active_link' : 'header_link')} to={'/mylist'}>My List</NavLink>
        </div>
      </div>
    </div>
  )
}