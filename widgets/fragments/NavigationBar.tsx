export const NavigationBar = () => {
    return (
        <div className="navigation-bar">
            <img src="/public/logos/logo.png"/>
            
            <nav>
                <a href="/" className="nav-link">
                    <h4>
                        Trang chủ
                    </h4>
                </a>
                <a href="/about" className="nav-link">
                    <h4>
                        Giới thiệu
                    </h4>
                </a>
                <a href="/contact" className="nav-link">
                    <h4>
                        Liên hệ
                    </h4>
                </a>
            </nav>

            <button className="icon-button" id="show-menu-button">
                <h4>
                    <i className="fas fa-bars"></i>
                </h4>
            </button>

            <nav id="nav-board" className="nav-board-hidden">
                <div className="nav-board-entry">
                    <a href="/" className="nav-link">
                        <h4>
                            Trang chủ
                        </h4>
                    </a>
                </div>
                <div className="nav-board-entry">
                    <a href="/about" className="nav-link">
                        <h4>
                            Giới thiệu
                        </h4>
                    </a>
                </div>
                <div className="nav-board-entry">
                    <a href="/contact" className="nav-link">
                        <h4>
                            Liên hệ
                        </h4>
                    </a>
                </div>
            </nav>
        </div>
    )
}