function Header(){
    return(
        <header>
            <div>
                <h2>Dashboard</h2>
                <p>Track your learning progress</p>
            </div>

            <div className="header-right">
                <button className="icon-button">
                 🔔
                </button>

                <div className="header-user">
                    <div className="profile-avather">AJ</div>
                    <span>Ajil</span>
                </div>
            </div>
        </header>
    )
}
export default Header;