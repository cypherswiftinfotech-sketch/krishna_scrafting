import { PenTool, Droplet, Sun, Hammer, Truck } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Design",
    description: "We collaborate with you to conceptualize the perfect piece, selecting the finest wood and resin colors to match your vision.",
    icon: <PenTool className="w-8 h-8" />,
    color: "rgb(15,82,186)",
  },
  {
    id: 2,
    title: "Pour",
    description: "The magic happens here. Our artisans carefully mix and pour the premium epoxy resin, creating mesmerizing ocean, river, or abstract patterns.",
    icon: <Droplet className="w-8 h-8" />,
    color: "#008080",
  },
  {
    id: 3,
    title: "Cure",
    description: "Patience is key. The resin is left to cure slowly in a controlled environment, ensuring maximum durability and a crystal-clear finish.",
    icon: <Sun className="w-8 h-8" />,
    color: "rgb(15,82,186)",
  },
  {
    id: 4,
    title: "Finish",
    description: "Hours of meticulous sanding and polishing bring out the deep luster of the resin and the natural beauty of the wood grain.",
    icon: <Hammer className="w-8 h-8" />,
    color: "#008080",
  },
  {
    id: 5,
    title: "Deliver",
    description: "Your masterpiece is securely packaged and delivered right to your door, ready to become the centerpiece of your space.",
    icon: <Truck className="w-8 h-8" />,
    color: "rgb(15,82,186)",
  },
];

export default function OurProcess() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
      <style>{`
        @keyframes floatCard {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floatIcon {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes flowLine {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-5 blur-3xl"
          style={{ background: "rgb(15,82,186)" }}
        />
        <div 
          className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full opacity-5 blur-3xl"
          style={{ background: "#008080" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#1f1f1f" }}>
            Our{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, rgb(15,82,186), #008080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Process
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#6b7280" }}>
            From raw materials to a breathtaking centerpiece, see how we bring your custom epoxy creations to life.
          </p>
        </div>

        {/* Winding Path Timeline */}
        <div className="relative">
          {/* Animated Winding SVG Line (Desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-64 -translate-x-1/2 pointer-events-none z-0">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 1000">
              <path 
                d="M50,0 C90,100 10,200 50,300 C90,400 10,500 50,600 C90,700 10,800 50,900 C90,1000 50,1000 50,1000" 
                fill="none" 
                stroke="url(#lineGrad)" 
                strokeWidth="2" 
                strokeDasharray="10,10"
                style={{ animation: "flowLine 8s linear infinite" }}
              />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(15,82,186)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#008080" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(15,82,186)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 !== 0; // 0-indexed, so 1, 3 are right-aligned
              const delay = index * 0.5; // Stagger animation
              
              return (
                <div key={step.id} className="relative flex flex-col md:flex-row items-center justify-between w-full z-10">
                  
                  {/* Left Side */}
                  <div className={`w-full md:w-[45%] flex ${isEven ? 'md:justify-start' : 'md:justify-end'} order-2 md:order-1 mt-6 md:mt-0`}>
                    {!isEven && (
                      <div className="text-center md:text-right bg-white p-8 rounded-3xl shadow-xl w-full"
                           style={{ 
                             border: "1px solid rgba(15,82,186,0.1)",
                             animation: `floatCard 4s ease-in-out infinite`,
                             animationDelay: `${delay}s`
                           }}>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: step.color }}>{step.id}. {step.title}</h3>
                        <p className="leading-relaxed" style={{ color: "#4b4b4b" }}>{step.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Center Node */}
                  <div className="order-1 md:order-2 flex justify-center items-center relative z-10 w-full md:w-[10%]">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-2xl relative"
                      style={{ 
                        border: `4px solid ${step.color}`,
                        animation: `floatCard 5s ease-in-out infinite`,
                        animationDelay: `${delay + 0.2}s`
                      }}
                    >
                      <div style={{ 
                        color: step.color,
                        animation: `floatIcon 3s ease-in-out infinite`,
                        animationDelay: `${delay}s`
                      }}>
                        {step.icon}
                      </div>
                      
                      {/* Connecting line for mobile */}
                      {index !== steps.length - 1 && (
                        <div 
                          className="md:hidden absolute top-full left-1/2 w-0.5 h-16 -translate-x-1/2"
                          style={{ 
                            backgroundImage: `linear-gradient(to bottom, ${step.color}40, transparent)`,
                            backgroundSize: "1px 10px",
                            backgroundRepeat: "repeat-y"
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className={`w-full md:w-[45%] flex ${isEven ? 'md:justify-start' : 'md:justify-end'} order-3 mt-6 md:mt-0`}>
                    {isEven && (
                      <div className="text-center md:text-left bg-white p-8 rounded-3xl shadow-xl w-full"
                           style={{ 
                             border: "1px solid rgba(0,128,128,0.1)",
                             animation: `floatCard 4s ease-in-out infinite`,
                             animationDelay: `${delay}s`
                           }}>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: step.color }}>{step.id}. {step.title}</h3>
                        <p className="leading-relaxed" style={{ color: "#4b4b4b" }}>{step.description}</p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
