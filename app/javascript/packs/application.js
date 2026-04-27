// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import "@hotwired/turbo-rails"
// import "controllers"
import '../../assets/stylesheets/application.css';
console.log("Tailwind pack cargado");

import ReactOnRails from 'react-on-rails';
import Planning from '../src/Planning/ror_components/Planning';

// Esto registra el componente para que Rails pueda usarlo con react_component('Planning')
ReactOnRails.register({ Planning });