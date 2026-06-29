import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Stethoscope, 
  Activity, 
  Pill, 
  Microscope,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Award,
  Hospital
} from 'lucide-react';

export default function App() {
  const phoneNumber = "09535564505";
  const mapLink = "https://www.google.com/maps/place/Dr.+Samskar+.+%7C+General+Physician+%7C+Diabetologist+Shubham+Family+%26+Diabetic+Clinic/@12.9412041,77.7250995,15.39z/data=!4m6!3m5!1s0x3bae13d1ecfc01d1:0x12228ad274340fc!8m2!3d12.9396672!4d77.7228844!16s%2Fg%2F11fhr1qnm2?hl=en&entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D";
  const address = "Shop No 2, Shubham family and Diabetic Clinic, Balagere Main Rd, opp. Baskin Robbins and Just Bake, beside Vin Tanduri chai, Balagere, Bengaluru, Karnataka 560087";

  return (
    <div className="min-h-screen bg-mint font-sans selection:bg-green selection:text-white overflow-x-hidden">
      {/* Top Bar */}
      <div className="bg-slate text-white py-2 px-4 sm:px-6 lg:px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <a href={`tel:${phoneNumber}`} className="flex items-center gap-1.5 hover:text-sage transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 95355 64505</span>
            </a>
            <div className="hidden sm:flex items-center gap-1.5 opacity-90">
              <Clock className="w-4 h-4" />
              <span>Mon-Sat: 8:15 AM - 9 PM | Sun: 10 AM - 4 PM</span>
            </div>
          </div>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-sage transition-colors">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[200px] sm:max-w-none">Balagere, Bengaluru</span>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 border-b border-sage shadow-sm/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-green rounded-xl flex items-center justify-center text-white shadow-sm shadow-green/20">
                <Hospital className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-sans tracking-tight font-bold text-lg sm:text-xl text-slate leading-tight">
                  Shubham Clinic
                </h1>
              </div>
            </div>
            
            <div className="hidden md:flex gap-8">
              <a href="#about" className="text-slate hover:text-green text-sm font-medium transition-colors">About Doctor</a>
              <a href="#services" className="text-slate hover:text-green text-sm font-medium transition-colors">Services</a>
              <a href="#visit" className="text-slate hover:text-green text-sm font-medium transition-colors">Visit Us</a>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href={`tel:${phoneNumber}`}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-mint text-slate hover:bg-sage/30 rounded-full text-sm font-medium transition-colors"
              >
                Call Clinic
              </a>
              <a 
                href={mapLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-green text-white hover:bg-green/90 rounded-full text-sm font-medium transition-colors shadow-sm shadow-green/20"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage/30 text-slate rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-sage/50">
                Trusted Healthcare Excellence
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display leading-[1.1] text-slate mb-6">
                Compassionate Care by <br/>
                <span className="text-green">Dr. Samskar</span>
              </h1>
              <p className="text-lg text-slate/80 mb-8 leading-relaxed max-w-md">
                Providing specialized diabetology and general physician services with an in-house pharmacy and diagnostic laboratory in Balagere, Bengaluru.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`tel:${phoneNumber}`}
                  className="inline-flex justify-center items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-sage group hover:border-green transition-colors"
                >
                  <div className="p-3 bg-mint rounded-full text-green group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-sage uppercase font-bold tracking-wider">Emergency Call</p>
                    <p className="text-lg font-bold text-slate">{phoneNumber}</p>
                  </div>
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:ml-auto"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate/10 border border-white/50 aspect-[4/3] lg:aspect-square max-w-[500px] w-full bg-white flex items-center justify-center">
                 {/* Using a highly professional placeholder as there is no specific image provided */}
                 <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
                    alt="Clinic Interior / Medical Care" 
                    className="object-cover w-full h-full"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate/40 to-transparent"></div>
                 
                 {/* Floating Badge */}
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-sage/50">
                    <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-green shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate font-display">Dr. Samskar .</p>
                      <p className="text-sm text-slate/80">General Physician & Diabetologist</p>
                    </div>
                 </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute -z-10 top-1/2 -right-12 w-32 h-32 bg-sage/40 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-12 -left-12 w-40 h-40 bg-sage/30 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctor Profile Section */}
      <section id="about" className="py-20 bg-mint border-t border-sage/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate mb-4">Meet the Doctor</h2>
            <div className="w-20 h-1.5 bg-green rounded-full mx-auto mb-6"></div>
            <p className="text-slate/80 text-lg">
              Dedicated to providing compassionate, evidence-based medical care for you and your family.
            </p>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-sage overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row items-center p-10 gap-10">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-mint border-4 border-white shadow-sm shadow-sage/20 flex items-center justify-center shrink-0">
               <Stethoscope className="w-16 h-16 text-green opacity-80" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold font-display text-slate mb-2">Dr. Samskar .</h3>
              <p className="text-green font-medium mb-4 text-lg">General Physician | Diabetologist</p>
              <p className="text-slate/80 mb-6 leading-relaxed">
                Expert care for diabetes management, general illnesses, and preventative health. At Shubham Clinic, we prioritize patient well-being through accurate diagnosis, personalized treatment plans, and continuous support.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-mint text-slate rounded-full text-xs font-bold tracking-wider uppercase border border-sage/30">Diabetes Management</span>
                <span className="px-4 py-1.5 bg-mint text-slate rounded-full text-xs font-bold tracking-wider uppercase border border-sage/30">Fever & Infections</span>
                <span className="px-4 py-1.5 bg-mint text-slate rounded-full text-xs font-bold tracking-wider uppercase border border-sage/30">Preventive Health</span>
                <span className="px-4 py-1.5 bg-mint text-slate rounded-full text-xs font-bold tracking-wider uppercase border border-sage/30">Family Medicine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-slate mb-4">Comprehensive Care Under One Roof</h2>
            <div className="w-20 h-1.5 bg-green rounded-full mx-auto mb-6"></div>
            <p className="text-slate/80 text-lg">
              We provide complete outpatient services including consultation, diagnostics, and pharmacy so you don't have to travel elsewhere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-mint rounded-[40px] p-8 border border-sage hover:shadow-lg hover:shadow-sage/20 transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-sage mb-6 group-hover:bg-green group-hover:text-white transition-colors text-green">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate mb-3">General Physician</h3>
              <p className="text-slate/80 leading-relaxed text-sm">
                Treatment for common ailments, fevers, infections, and routine medical checkups for all ages.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-mint rounded-[40px] p-8 border border-sage hover:shadow-lg hover:shadow-sage/20 transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-sage mb-6 group-hover:bg-green group-hover:text-white transition-colors text-green">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate mb-3">Diabetology</h3>
              <p className="text-slate/80 leading-relaxed text-sm font-medium">
                Specialized care for Type 1 and Type 2 diabetes management, diet counseling, and complication prevention.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-mint rounded-[40px] p-8 border border-sage hover:shadow-lg hover:shadow-sage/20 transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-sage mb-6 group-hover:bg-green group-hover:text-white transition-colors text-green">
                <Microscope className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate mb-3">Diagnostic & Lab</h3>
              <p className="text-slate/80 leading-relaxed text-sm">
                In-house laboratory for quick and accurate blood tests, sugar monitoring, and essential diagnostics.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-mint rounded-[40px] p-8 border border-sage hover:shadow-lg hover:shadow-sage/20 transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-sage mb-6 group-hover:bg-green group-hover:text-white transition-colors text-green">
                <Pill className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate mb-3">Medical Shop</h3>
              <p className="text-slate/80 leading-relaxed text-sm">
                Fully stocked pharmacy ensuring you get your prescribed medicines immediately after consultation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location & Timings Section */}
      <section id="visit" className="py-24 bg-mint relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            
            <div className="bg-slate rounded-[40px] p-10 text-white shadow-xl shadow-slate/10">
              <h2 className="text-3xl font-display font-bold mb-4">Visit Our Clinic</h2>
              <div className="w-16 h-1 bg-green rounded-full mb-10"></div>
              
              <div className="space-y-10">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-display mb-3">Clinic Timings</h4>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex justify-between max-w-xs pb-3 border-b border-white/10">
                        <span>Mon - Sat</span>
                        <span className="font-medium text-white">8:15 AM - 9:00 PM</span>
                      </li>
                      <li className="flex justify-between max-w-xs pt-1">
                        <span>Sunday</span>
                        <span className="font-medium text-white">10:00 AM - 4:00 PM</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-display mb-3">Location</h4>
                    <p className="text-white/80 max-w-sm leading-relaxed mb-4">
                      {address}
                    </p>
                    <a 
                      href={mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-2xl text-sm font-bold hover:bg-green/90 transition-colors"
                    >
                      Get Directions <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-sage rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <Phone className="w-6 h-6 text-slate" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-display mb-2">Contact</h4>
                    <p className="text-white/80 mb-1 text-sm">Call us to book an appointment</p>
                    <a href={`tel:${phoneNumber}`} className="text-2xl font-bold text-white hover:text-sage transition-colors">
                      {phoneNumber}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white h-20 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-12 border-t border-sage text-[11px] font-bold uppercase tracking-widest text-slate">
        <div>© {new Date().getFullYear()} Shubham Clinic</div>
        <div className="hidden md:flex space-x-6">
          <span>Internal Medicine</span>
          <span>Diabetic Care</span>
          <span>Pharmacy</span>
          <span>Lab Tests</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
          <span>Open Now</span>
        </div>
      </footer>
    </div>
  );
}
