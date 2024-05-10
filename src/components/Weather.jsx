import WeatherBox from "./WeatherBox";
import Rain from "../assets/images/sky.jpg";
export default function Weather() {
  return (
    <main>
      <section className='weather'>
        <div className='weather-image__wrapper'>
          <img className='weather-image' src={Rain} alt='rain' />
        </div>
        <div className='wrapper weather--wrapper'>
          <WeatherBox />
        </div>
      </section>
    </main>
  );
}
