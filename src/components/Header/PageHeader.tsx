import { NavLink } from "react-router-dom";

import './PageHeader.css'

export const PageHeader = () => {
  return (
    <div className="header_background">
      <div className="header_box">
        <p className="header_title">MealHunt</p>
        <div className="header_linkbox">
          <NavLink className={({isActive}) => (isActive ? 'header_active_link' : 'header_link')} to={'/MealHunt/'}>Random Meal</NavLink>
          <NavLink className={({isActive}) => (isActive ? 'header_active_link' : 'header_link')} to={'/MealHunt/mylist'}>My List</NavLink>
        </div>
      </div>
    </div>
  )
}