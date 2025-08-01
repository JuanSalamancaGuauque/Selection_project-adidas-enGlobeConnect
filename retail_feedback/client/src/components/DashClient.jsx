import adidas from './assets/adidaswhite.png';
import idol from './assets/jefe.png';
import Fbackground from './assets/background.jpg';
import './DashClient.css';

export default function DashClient() {
  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${Fbackground})` }}
    >
      <div className="chart_container">
        <div className="chart_box">
          {/* First column */}
          <div className="column First_column">
            <img src={adidas} alt="adidas logo" className="adidas_logo" />

            <div className="store_container">
              <p className="store_name">adidas Store Example</p>
            </div>

            <div className="fundation">
              <span>19</span>
              <div className="divider"></div>
              <span>24</span>
            </div>
          </div>

          {/* Second column */}
          <div className="column Second_column">
            <img src={idol} alt="adidas idol" className="idol_img" />
          </div>

          {/* Third Column */}
          <div className="column Third_column">
            <h2>WE ARE THE BEST OPTION FOR YOU</h2>
            <p className="subtittle">WE DON'T SAY IT, YOU SAY IT</p>

            <div className="ratings">
              <div className="rating_item">
                <div className="stars">
                  ★★★★★<span className="half">☆</span>
                </div>
                <p>PRODUCT AVAILABILITY</p>
              </div>

              <div className="rating_item">
                <div className="stars">★★★★★</div>
                <p>STORE CARE</p>
              </div>

              <div className="rating_item">
                <div className="stars">
                  ★★★★★<span className="half">☆</span>
                </div>
                <p>GENERAL SATISFACTION</p>
              </div>
            </div>

            <div className="comment_box">
              <em>"The best place to buy sportswear"</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
