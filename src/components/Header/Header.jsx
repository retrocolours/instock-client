import './Header.scss';
import { Link } from "react-router-dom";
import headerImg from "../../assets/logo/InStock-Logo.svg";

function Header() {

    return(

    <header className="header">
        <Link to="/"><img className="header__img" src={headerImg} alt="instock arrow logo" /></Link>
        <div className="header__buttons">
            <Link to="/"><button className="header__warehouse-button"><h3>Warehouses</h3></button></Link>
            <Link to="/inventory"><button className="header__inventory-button"><h3>Inventory</h3></button></Link>
        </div>
    </header>

    )
}

export default Header;