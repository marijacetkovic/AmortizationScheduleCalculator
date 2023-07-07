import logo from './logo.svg';
import './App.css';
import Header from './Components/header';
import RegistrationForm from './Components/registrationForm'

function App() {
  return (
    
    <div className="App">
      <ul class="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-0 shadow-sm" id="pillNav2" role="tablist">
   <li class="nav-item" role="presentation">
    <button class="nav-link active rounded-0" id="home-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">Home</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link rounded-0" id="profile-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="false">Profile</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link rounded-0" id="contact-tab2" data-bs-toggle="tab" type="button" role="tab" aria-selected="false">Contact</button>
  </li>
</ul>
      <Header/>
      <RegistrationForm/>
    </div>
  );
}

export default App;