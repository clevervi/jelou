// Configuración global mejorada
class LoveWebsite {
    constructor() {
        this.indiceCarrusel = 0;
        // Fecha de inicio actualizada al 6 de Octubre 2025
        this.fechaInicio = new Date('2025-10-06T00:00:00');
        this.isLoading = true;
        this.observers = [];
        
        this.mensajesAmor = [
            "Eres la persona más increíble que he conocido",
            "Tu sonrisa ilumina mis días",
            "Amo cada momento a tu lado",
            "Eres mi razón para ser mejor persona",
            "Contigo he encontrado el verdadero amor",
            "Eres mi sueño hecho realidad",
            "No hay nadie como tú en todo el mundo",
            "Te amo más de lo que las palabras pueden expresar",
            "Eres mi paz y mi aventura",
            "Mi corazón late por ti"
        ];

        // Nuevas funcionalidades
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.audioPlayer = new Audio();
        this.songs = [
            { title: "FIFTY FIFTY - Cupid", src: "mp3/FIFTY FIFTY - Cupid (Twin Version) (Lyrics) - Creative Chaos.mp3" },
            { title: "Muestra - SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
        ];
        
        // Preguntas del Quiz actualizadas para coincidir con la nueva fecha
        this.quizQuestions = [
            {
                question: "¿En qué fecha comenzamos oficialmente nuestra relación?",
                options: ["30 de Octubre, 2025", "6 de Octubre, 2025", "14 de Febrero, 2025", "4 de Noviembre, 2025"],
                correct: 1 // El índice 1 es la respuesta correcta (6 de Octubre)
            },
            {
                question: "¿Dónde fue nuestro primer encuentro?",
                options: ["En Riwi", "En un café", "En un concierto", "Por medio de amigos"],
                correct: 0
            },
            {
                question: "¿Cuál es mi comida favorita que preparas?",
                options: ["Lasagna", "Pasta carbonara", "Pizza casera", "Ensalada César"],
                correct: 2
            },
            {
                question: "¿Qué película vimos en nuestra primera cita?",
                options: ["Titanic", "Your Name", "La La Land", "No recuerdo"],
                correct: 1
            }
        ];
        
        // Definir las fotos personales que faltaban
        this.personalPhotos = [
            { src: "img/WhatsApp Image 2025-11-30 at 1.25.04 PM.jpeg", caption: "En Riwi - Donde todo comenzó" },
            { src: "img/WhatsApp Image 2025-11-30 at 1.25.05 PM.jpeg", caption: "Proyecto Riwi - Construyendo juntos" },
            { src: "img/WhatsApp Image 2025-11-30 at 1.25.05 PM (1).jpeg", caption: "Portal del Prado - Nuestro lugar especial" }
        ];
        
        this.currentQuizQuestion = 0;
        this.quizScore = 0;

        this.init();
    }

    async init() {
        try {
            await this.preloadResources();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.createFloatingHearts();
            this.setupMusicPlayer();
            this.setupPhotoGallery();
            this.setupCountdowns();
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            this.hideLoadingScreen();
        }
    }

    async preloadResources() {
        const images = [
            'https://source.unsplash.com/random/1600x900/?couple,love',
            'https://source.unsplash.com/random/800x600/?couple,beach',
            'https://source.unsplash.com/random/800x600/?couple,mountains',
            'https://source.unsplash.com/random/800x600/?couple,city',
            'https://source.unsplash.com/random/800x600/?couple,sunset'
        ];

        // Precargar imágenes de Unsplash
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        // Precargar imágenes personales
        this.personalPhotos.forEach(photo => {
            const img = new Image();
            img.src = photo.src;
        });
        
        return Promise.resolve();
    }

    setupEventListeners() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.updateActiveNav(anchor.getAttribute('href'));
                }
            });
        });

        const botonSorpresa = document.getElementById('botonSorpresa');
        if (botonSorpresa) botonSorpresa.addEventListener('click', () => this.mostrarMensajeAleatorio());

        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) scrollToTopBtn.addEventListener('click', () => this.scrollToTop());

        const scrollToContentBtn = document.getElementById('scrollToContent');
        if (scrollToContentBtn) scrollToContentBtn.addEventListener('click', () => this.scrollToContent());

        const addPhotoBtn = document.getElementById('addPhotoBtn');
        if (addPhotoBtn) addPhotoBtn.addEventListener('click', () => this.triggerPhotoUpload());

        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) photoUpload.addEventListener('change', (e) => this.handlePhotoUpload(e));

        const printLetterBtn = document.getElementById('printLetterBtn');
        if (printLetterBtn) printLetterBtn.addEventListener('click', () => this.printLoveLetter());

        const shareLetterBtn = document.getElementById('shareLetterBtn');
        if (shareLetterBtn) shareLetterBtn.addEventListener('click', () => this.shareLoveLetter());

        const startQuizBtn = document.getElementById('startQuizBtn');
        if (startQuizBtn) startQuizBtn.addEventListener('click', () => this.startQuiz());

        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', () => this.nextQuizQuestion());

        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeImageModal());

        // Music upload controls
        const uploadSongBtn = document.getElementById('uploadSongBtn');
        const musicUpload = document.getElementById('musicUpload');
        if (uploadSongBtn && musicUpload) {
            uploadSongBtn.addEventListener('click', () => musicUpload.click());
            musicUpload.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                this.audioPlayer.src = url;
                this.audioPlayer.load();
                this.isPlaying = false; // togglePlay will flip
                const musicInfo = document.getElementById('musicInfo');
                if (musicInfo) musicInfo.textContent = file.name;
                // play after user explicitly selected file
                this.togglePlay();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });

        this.setupContador();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.updateActiveNav('#' + entry.target.id);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.timeline-item, .razon, .cita, .promise-card').forEach(el => {
            observer.observe(el);
        });
    }

    updateActiveNav(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    setupContador() {
        this.actualizarContador();
        setInterval(() => this.actualizarContador(), 1000);
    }

    actualizarContador() {
        const ahora = new Date();
        const diferencia = ahora - this.fechaInicio;
        
        const anos = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
        const meses = Math.floor((diferencia % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const dias = Math.floor((diferencia % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        
        const elAnos = document.getElementById('anos');
        const elMeses = document.getElementById('meses');
        const elDias = document.getElementById('dias');
        const elHoras = document.getElementById('horas');
        const elMinutos = document.getElementById('minutos');

        if (elAnos) elAnos.textContent = anos;
        if (elMeses) elMeses.textContent = meses;
        if (elDias) elDias.textContent = dias;
        if (elHoras) elHoras.textContent = horas;
        if (elMinutos) elMinutos.textContent = minutos;
    }

    mostrarMensajeAleatorio() {
        const mensaje = this.mensajesAmor[Math.floor(Math.random() * this.mensajesAmor.length)];
        this.mostrarNotificacion(mensaje, 'success');
        this.crearExplosionCorazones();
        this.createHeartRain();
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        const bgColor = tipo === 'success' ? 'bg-red-700' : 'bg-red-900';
        
        notificacion.className = `fixed top-24 left-1/2 transform -translate-x-1/2 ${bgColor} text-white py-3 px-6 rounded-lg shadow-xl z-50 animate-bounce-in`;
        notificacion.textContent = mensaje;
        notificacion.setAttribute('role', 'alert');
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('animate-fade-out');
            setTimeout(() => notificacion.remove(), 500);
        }, 3000);
    }

    crearExplosionCorazones() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.crearCorazon({
                    clientX: window.innerWidth / 2,
                    clientY: window.innerHeight / 2
                });
            }, i * 100);
        }
    }

    crearCorazon(e) {
        const corazon = document.createElement('div');
        corazon.className = 'particle heart';
        corazon.innerHTML = '❤️';
        corazon.style.left = `${e.clientX}px`;
        corazon.style.top = `${e.clientY}px`;
        corazon.style.fontSize = `${Math.random() * 20 + 15}px`;
        
        document.body.appendChild(corazon);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = e.clientX;
        let y = e.clientY;
        let opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy;
            vy += 0.1; 
            opacity -= 0.02;
            
            corazon.style.left = `${x}px`;
            corazon.style.top = `${y}px`;
            corazon.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                corazon.remove();
            }
        };
        
        animate();
    }

    createFloatingHearts() {
        const container = document.querySelector('.floating-hearts');
        if (!container) return;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.animationDelay = `${Math.random() * 6}s`;
                container.appendChild(heart);
            }, i * 300);
        }
    }

    createHeartRain() {
        const container = document.getElementById('heartRain');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-drop';
                heart.innerHTML = '❤️';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
                container.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 5000);
            }, i * 100);
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollToContent() {
        const inicioSection = document.getElementById('inicio');
        if (inicioSection) {
            inicioSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
            }, 500);
        }
    }

    crearConfeti() {
        const colores = ['#dc2626', '#991b1b', '#7f1d1d', '#450a0a', '#ef4444'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confeti = document.createElement('div');
                confeti.className = 'particle confeti';
                confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
                confeti.style.left = `${Math.random() * 100}vw`;
                confeti.style.top = '-10px';
                confeti.style.width = `${Math.random() * 10 + 5}px`;
                confeti.style.height = `${Math.random() * 10 + 5}px`;
                confeti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                
                document.body.appendChild(confeti);
                
                const animacion = confeti.animate([
                    { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                    { transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 2000,
                    easing: 'cubic-bezier(0.1, 0.2, 0.8, 0.9)'
                });
                
                animacion.onfinish = () => confeti.remove();
            }, i * 30);
        }
    }

    setupMusicPlayer() {
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const volumeBtn = document.getElementById('volumeBtn');
        const musicInfo = document.getElementById('musicInfo');

        if (!playBtn || !prevBtn || !nextBtn || !volumeBtn || !musicInfo) {
            return;
        }

        this.audioPlayer.volume = 0.5;

        playBtn.addEventListener('click', () => this.togglePlay());
        prevBtn.addEventListener('click', () => this.previousSong());
        nextBtn.addEventListener('click', () => this.nextSong());
        volumeBtn.addEventListener('click', () => this.toggleMute());

        this.audioPlayer.addEventListener('ended', () => this.nextSong());

        if (this.songs && this.songs.length > 0) {
            // Cargar la primera canción local
            this.loadSong(0);
        }
    }

    loadSong(index) {
        this.currentSongIndex = index;
        this.audioPlayer.src = this.songs[index].src;
        const musicInfo = document.getElementById('musicInfo');
        if (musicInfo) musicInfo.textContent = this.songs[index].title;

        if (this.isPlaying) {
            this.audioPlayer.play().catch(err => console.warn('No se pudo reproducir automáticamente:', err));
        }
    }

    togglePlay() {
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn ? playBtn.querySelector('i') : null;

        if (this.isPlaying) {
            this.audioPlayer.pause();
            if (icon) { icon.classList.remove('fa-pause'); icon.classList.add('fa-play'); }
        } else {
            this.audioPlayer.play().catch(err => console.warn('Reproducción fallida:', err));
            if (icon) { icon.classList.remove('fa-play'); icon.classList.add('fa-pause'); }
        }

        this.isPlaying = !this.isPlaying;
    }

    previousSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
    }

    toggleMute() {
        const volumeBtn = document.getElementById('volumeBtn');
        const icon = volumeBtn ? volumeBtn.querySelector('i') : null;

        if (this.audioPlayer.volume > 0) {
            this.audioPlayer.volume = 0;
            if (icon) { icon.classList.remove('fa-volume-up'); icon.classList.add('fa-volume-mute'); }
        } else {
            this.audioPlayer.volume = 0.5;
            if (icon) { icon.classList.remove('fa-volume-mute'); icon.classList.add('fa-volume-up'); }
        }
    }

    setupPhotoGallery() {
        const galleryContainer = document.querySelector('.personal-gallery');
        if (!galleryContainer) return;
        
        // Limpiar contenedor primero
        galleryContainer.innerHTML = '';
        
        // Añadir las fotos personales
        this.personalPhotos.forEach(photo => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.caption;
            img.onerror = () => {
                // Si la imagen no se carga, usar una imagen de placeholder
                img.src = 'https://source.unsplash.com/random/800x600/?couple,love';
                img.alt = 'Imagen no disponible';
            };
            
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = `<p>${photo.caption}</p>`;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(overlay);
            
            galleryItem.addEventListener('click', () => this.openImageModal(photo.src, photo.caption));
            
            galleryContainer.appendChild(galleryItem);
        });
    }

    triggerPhotoUpload() {
        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) photoUpload.click();
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const newPhoto = {
                    src: e.target.result,
                    caption: 'Nuevo recuerdo'
                };
                
                this.personalPhotos.push(newPhoto);
                
                const galleryContainer = document.querySelector('.personal-gallery');
                if (!galleryContainer) return;
                
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = newPhoto.src;
                img.alt = newPhoto.caption;
                
                const overlay = document.createElement('div');
                overlay.className = 'gallery-overlay';
                overlay.innerHTML = `<p>${newPhoto.caption}</p>`;
                
                galleryItem.appendChild(img);
                galleryItem.appendChild(overlay);
                
                galleryItem.addEventListener('click', () => this.openImageModal(newPhoto.src, newPhoto.caption));
                
                galleryContainer.appendChild(galleryItem);
                
                this.mostrarNotificacion('¡Foto añadida con éxito!', 'success');
            };
            
            reader.readAsDataURL(file);
        }
    }

    openImageModal(src, caption) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        
        if (!modal || !modalImage) return;
        
        modalImage.src = src;
        modalImage.alt = caption;
        
        modal.classList.add('active');
    }

    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) modal.classList.remove('active');
    }

    closeAllModals() {
        this.closeImageModal();
    }

    printLoveLetter() {
        const letterContent = document.querySelector('.love-letter');
        if (!letterContent) return;
        
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Carta de Amor</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .love-letter { max-width: 800px; margin: 0 auto; }
                </style>
            </head>
            <body>
                ${letterContent.innerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    shareLoveLetter() {
        if (navigator.share) {
            navigator.share({
                title: 'Mi Carta de Amor',
                text: 'Lee esta hermosa carta de amor que he escrito para ti',
                url: window.location.href
            })
            .then(() => console.log('Contenido compartido exitosamente'))
            .catch((error) => console.log('Error al compartir:', error));
        } else {
            this.mostrarNotificacion('La función de compartir no está disponible en tu navegador', 'info');
        }
    }

    startQuiz() {
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        
        const startQuizBtn = document.getElementById('startQuizBtn');
        const quizResult = document.getElementById('quizResult');
        
        if (startQuizBtn) startQuizBtn.classList.add('hidden');
        if (quizResult) quizResult.classList.add('hidden');
        
        this.showQuizQuestion();
    }

    showQuizQuestion() {
        const question = this.quizQuestions[this.currentQuizQuestion];
        const quizQuestion = document.getElementById('quizQuestion');
        const quizOptions = document.getElementById('quizOptions');
        
        if (!quizQuestion || !quizOptions) return;
        
        quizQuestion.textContent = question.question;
        quizOptions.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            
            optionElement.addEventListener('click', () => this.selectQuizOption(optionElement));
            
            quizOptions.appendChild(optionElement);
        });
        
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        if (nextQuestionBtn) nextQuestionBtn.classList.add('hidden');
    }

    selectQuizOption(selectedOption) {
        const options = document.querySelectorAll('.quiz-option');
        const correctIndex = this.quizQuestions[this.currentQuizQuestion].correct;
        
        options.forEach(option => {
            option.classList.remove('selected');
            if (parseInt(option.dataset.index) === correctIndex) {
                option.classList.add('selected');
            }
        });
        
        if (parseInt(selectedOption.dataset.index) === correctIndex) {
            this.quizScore++;
            selectedOption.classList.add('selected');
        }
        
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        if (nextQuestionBtn) nextQuestionBtn.classList.remove('hidden');
    }

    nextQuizQuestion() {
        this.currentQuizQuestion++;
        
        if (this.currentQuizQuestion < this.quizQuestions.length) {
            this.showQuizQuestion();
        } else {
            this.showQuizResults();
        }
    }

    showQuizResults() {
        const quizResult = document.getElementById('quizResult');
        const startQuizBtn = document.getElementById('startQuizBtn');
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        
        if (!quizResult) return;
        
        const percentage = (this.quizScore / this.quizQuestions.length) * 100;
        
        let message = '';
        if (percentage === 100) {
            message = '¡Perfecto! Conoces nuestra relación al 100% 💖';
        } else if (percentage >= 70) {
            message = `¡Muy bien! Obtuviste ${this.quizScore} de ${this.quizQuestions.length} correctas`;
        } else {
            message = `Puedes mejorar. Obtuviste ${this.quizScore} de ${this.quizQuestions.length} correctas`;
        }
        
        quizResult.textContent = message;
        quizResult.classList.remove('hidden');
        
        if (startQuizBtn) startQuizBtn.classList.remove('hidden');
        if (nextQuestionBtn) nextQuestionBtn.classList.add('hidden');
        
        if (percentage === 100) {
            this.crearConfeti();
        }
    }

    setupCountdowns() {
        this.updateCountdowns();
        setInterval(() => this.updateCountdowns(), 1000 * 60 * 60); 
    }

    updateCountdowns() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Aniversario actualizado al 6 de Octubre (Mes 9 es Octubre)
        let anniversary = new Date(currentYear, 9, 6); 
        if (now > anniversary) {
            anniversary = new Date(currentYear + 1, 9, 6);
        }
        const anniversaryDays = Math.ceil((anniversary - now) / (1000 * 60 * 60 * 24));
        const anniversaryElement = document.getElementById('anniversaryCountdown');
        if (anniversaryElement) anniversaryElement.textContent = `Faltan ${anniversaryDays} días`;
        
        let birthday = new Date(currentYear, 0, 1);
        if (now > birthday) {
            birthday = new Date(currentYear + 1, 0, 1);
        }
        const birthdayDays = Math.ceil((birthday - now) / (1000 * 60 * 60 * 24));
        const birthdayElement = document.getElementById('birthdayCountdown');
        if (birthdayElement) birthdayElement.textContent = `Faltan ${birthdayDays} días`;
        
        let valentine = new Date(currentYear, 1, 14);
        if (now > valentine) {
            valentine = new Date(currentYear + 1, 1, 14);
        }
        const valentineDays = Math.ceil((valentine - now) / (1000 * 60 * 60 * 24));
        const valentineElement = document.getElementById('valentineCountdown');
        if (valentineElement) valentineElement.textContent = `Faltan ${valentineDays} días`;
        
        // Primer encuentro también actualizado al 6 de Octubre
        let firstMeet = new Date(currentYear, 9, 6);
        if (now > firstMeet) {
            firstMeet = new Date(currentYear + 1, 9, 6);
        }
        const firstMeetDays = Math.ceil((firstMeet - now) / (1000 * 60 * 60 * 24));
        const firstMeetElement = document.getElementById('firstMeetCountdown');
        if (firstMeetElement) firstMeetElement.textContent = `Faltan ${firstMeetDays} días`;
    }
}

// Funciones globales para compatibilidad
function mostrarMensajeSecreto(indice) {
    const mensaje = document.getElementById(`mensajeSecreto${indice}`);
    if (mensaje) mensaje.classList.remove('hidden');
}

function ocultarMensajeSecreto(indice) {
    const mensaje = document.getElementById(`mensajeSecreto${indice}`);
    if (mensaje) mensaje.classList.add('hidden');
}

function verificarPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const contenidoSecreto = document.getElementById('contenidoSecreto');
    
    if (!passwordInput || !contenidoSecreto) return;
    
    // Contraseña actualizada a la nueva fecha (06102025)
    if (passwordInput.value === '06102025') {
        contenidoSecreto.classList.remove('hidden');
        contenidoSecreto.classList.add('animate-pulse');
        passwordInput.value = '';
        
        if (window.loveApp) {
            window.loveApp.crearConfeti();
        }
    } else {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-900 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-bounce-in';
        errorMsg.textContent = 'Fecha incorrecta. Intenta nuevamente.';
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg.classList.add('animate-fade-out');
            setTimeout(() => errorMsg.remove(), 500);
        }, 3000);
        
        passwordInput.value = '';
    }
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Mira esta hermosa página de amor que creé para ti 💖');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Mira esta hermosa página de amor 💖');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    window.loveApp = new LoveWebsite();
});