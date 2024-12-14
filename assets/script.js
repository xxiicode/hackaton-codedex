console.log("hello from script.js");
const bodyElement = document.body;

// AUDIO PLAYER
const itemFound = new Audio('assets/sounds/item-found.mp3');
const pikaSound = new Audio('assets/sounds/pikachu.mp3');
const plinkSound = new Audio('assets/sounds/plink.mp3');
const recoverySound = new Audio('assets/sounds/recovery.mp3');
const gengarSound = new Audio('assets/sounds/gengar.mp3');
const catchSound = new Audio('assets/sounds/pokemon-catch.mp3');
const battleSound = new Audio('assets/sounds/battle.mp3');


// POKEMON TCG API
//
if (bodyElement.id === "pokedex") {
    //variables initialization
    let firsttimeNoSound = true;
    let totalPages = 1;
    let pkmImg = '';
    let pkmArray = [];
    let dataSet = 'base1';
    let currentPage = 1;
    const pageSize = 8;

    // for the pagination issues
    if (currentPage === 1) {
        document.getElementById('prev-btn').style.display = "none";
    }

    // function - Fetch cards from the API
    function fetchCards(page) {
        const cardContainer = document.getElementById('cards-db');
        const pager = document.getElementById('current-page');

        // show loading message
        cardContainer.innerHTML = '<p>Loading...</p>';
        pager.innerText = 'Page ? ';

        // fetch
        fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${dataSet}&page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'cfee0bd1-e395-47ee-9266-52c0bd65da0a'
            }
        })
            .then(response => response.json())
            .then(recieveCards)
            .catch(handleFetchError);
    }

    // function to process the array of cards
    function recieveCards(pkm) {
        pkmArray = pkm.data;
        if (pkm.totalCount && totalPages === 1) {
            totalPages = Math.ceil(pkm.totalCount / pageSize);
            console.log(`Total pages: ${totalPages}`);
        }
        cardImage();
    }

    // function - Create card images
    function cardImage() {
        const cardContainer = document.getElementById('cards-db');
        cardContainer.innerHTML = '';
        const pager = document.getElementById('current-page');
        pager.innerText = `Page ${currentPage}`;

        if (pkmArray.length === 0) {
            cardContainer.innerHTML = '<p>No cards recovery. try again!</p>';
            return;
        }

        pkmArray.forEach(pkm => {
            pkmImg = pkm.images.small;
            const card = document.createElement('img');
            card.src = pkmImg;
            card.className = 'card';
            cardContainer.appendChild(card);
        });
        if (!firsttimeNoSound) {
            plinkSound.currentTime = 0;
            plinkSound.play();
        }
        firsttimeNoSound = false;

    }

    // ASIDE - change the set of cards
    document.querySelectorAll('.set-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            dataSet = e.target.dataset.set;
            currentPage = 1;
            fetchCards(currentPage);
            setTitle(e.target.innerText);
            document.querySelector('.set-btn.active').classList.remove('active');
            btn.classList.add('active');
            totalPages = 1;
            document.getElementById('prev-btn').style.display = "none";
            document.getElementById('next-btn').style.display = "block";
            itemFound.currentTime = 0;
            firsttimeNoSound = true;
            itemFound.play();
        })
    });

    // PAGINATION - previous button
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchCards(currentPage);
            if (currentPage === 1) {
                document.getElementById('prev-btn').style.display = "none";
                document.querySelector('.pagination').style.justifyContent = "flex-end";
            }
            if (currentPage === totalPages - 1) {
                document.getElementById('next-btn').style.display = "block";
            }
        }
    });

    
    // PAGINATION - next button
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchCards(currentPage);
            if (currentPage === totalPages) {
                document.getElementById('next-btn').style.display = "none";
                document.querySelector('.pagination').style.justifyContent = "flex-start";
            }
            document.getElementById('prev-btn').style.display = "block";
        }
    });


    // function - Set title of colection
    function setTitle(set = 'Base Set') {
        document.getElementById('set-title').innerHTML = set;
    }



    // Play Pikachu sound
    const pikachu = document.getElementById('pikachuAdds');
    if (pikachu) {
        pikachu.addEventListener('mouseenter', () => {
            pikaSound.currentTime = 0;
            pikaSound.play();

        })
    };

    // adds sounds 
    const top20 = document.getElementById('top20');
    const logos = document.getElementById('logos');

    if (top20) {
        top20.addEventListener('click', () => {
            recoverySound.currentTime = 0;
            recoverySound.play();
        })
    };
    if (logos) {
        logos.addEventListener('click', () => {
            catchSound.currentTime = 0;
            catchSound.play();
        })
    };


    // Gengar Dream fetch
    const gengar = document.getElementById('gengar-dream');
    if (gengar) {
        gengar.addEventListener('click', () => {
            gengarSound.currentTime = 0;
            gengarSound.play();
            fetch(`https://api.pokemontcg.io/v2/cards?q=name:gengar&page=1&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'cfee0bd1-e395-47ee-9266-52c0bd65da0a'
                }
            })
                .then(res => res.json())
                .then(recieveCards)
                .then(() => {
                    setTitle('Gengar Cards');
                })
                .catch(handleFetchError);

        });
    }



    // calling the functions
    fetchCards(currentPage);
    setTitle();
    document.getElementById('base-set').classList.add('active');

}

// Custom cursor
if (window.innerWidth > 900) {

    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {

        cursor.style.left = `${e.pageX - cursor.offsetWidth / 2}px`;
        cursor.style.top = `${e.pageY - cursor.offsetHeight / 2}px`;
    });
}

// handle error on Catch
function handleFetchError(error) {
    cardContainer.innerHTML = '<p>Error loading cards. Please try again.</p>';
    console.error('Error fetching data:', error);
}





// Injection of html
const header = document.getElementById('header');
if (header) {
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            header.innerHTML = html;
        })
        .catch(error => console.error('Error loading header:', error));
} else {
    console.error('Header element not found');
}



// home

const banner = document.getElementById('banner-sound');
let soundPlayed = false; // Variable de control para asegurarse de que el sonido se reproduce solo una vez

if (banner) {
    // Creamos el IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !soundPlayed) {
                // Si el banner está visible y el sonido aún no se ha reproducido
                battleSound.currentTime = 0; // Reinicia el sonido
                battleSound.play(); // Reproduce el sonido
                soundPlayed = true; // Marca que el sonido ya se ha reproducido
            }
        });
    }, { threshold: 0.5 }); // El sonido se activa cuando el 50% del banner es visible

    observer.observe(banner); // Comienza a observar el banner
}
