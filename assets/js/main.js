

const BASEURL = "/RecordStoreBarFoo/assets/data/";
let vinyl = null;
let genre = null;

function ajaxCallBack(nazivFajla, rezultat) {
    $.ajax({
        url: BASEURL + nazivFajla,
        method: "get",
        dataType: "json",
        success: rezultat,
        error: function (jqXHR, exception) {
            var msg = "";

            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }
    })
}
window.onload = function () {
    console.log('on load')

    let url = window.location.pathname;
    console.log('currentUrl', url);

    if (url == "/" || url == "/RecordStoreBarFoo/" || url == '/RecordStoreBarFoo/index.html') {
        console.log('da li ulazi ovde')
        ajaxCallBack("menu.json", function (rezultat) {
            ispisNavigacije(rezultat);
        })

        ajaxCallBack("indexPageVinyl.json", function (rezultat) {
            ispisCarouselProizvoda(rezultat);
            sacuvajLS("svicarouselProizvodi", rezultat);
        })

        ajaxCallBack("songs.json", function (rezultat) {
            songList(rezultat);
            muzika();
        })
        ajaxCallBack("footer.json", function (rezultat) {
            ispisFootera(rezultat);
        })
        ajaxCallBack("vinylPage.json", function (rezultat) {
            ispisProizvodanaIndexStraniciAlbum(rezultat);
        })

    }
    if (url == "/RecordStoreBarFoo/author.html") {
        ajaxCallBack("menu.json", function (rezultat) {
            ispisNavigacije(rezultat);


        })
    }

    if (url == "/RecordStoreBarFoo/contact.html") {
        ajaxCallBack("menu.json", function (rezultat) {
            ispisNavigacije(rezultat);


        })

        const form = document.getElementById('form');
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const password2 = document.getElementById('password2');

        form.addEventListener('submit', e => {
            e.preventDefault();

            checkInputs();
        });

        function checkInputs() {
            const usernameValue = username.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();
            const password2Value = password2.value.trim();

            if (usernameValue === '') {
                setErrorFor(username, 'Username cannot be blank');
            } else {
                setSuccessFor(username);
            }
            if (emailValue === '') {
                setErrorFor(email, 'Email cannot be blank');
            } else if (!isEmail(emailValue)) {
                setErrorFor(email, 'Not a valid email, try:username@gmail.com');
            } else {
                setSuccessFor(email);
            }
            if (passwordValue === '') {
                setErrorFor(password, 'Password cannot be blank');
            } else {
                setSuccessFor(password);
            }

            if (password2Value === '') {
                setErrorFor(password2, 'Password2 cannot be blank');
            } else if (passwordValue !== password2Value) {
                setErrorFor(password2, 'Passwords does not match');
            } else {
                setSuccessFor(password2);
            }



        }
        function setErrorFor(input, message) {
            const formControl = input.parentElement;
            const small = formControl.querySelector('small');
            formControl.className = 'form-control error';
            small.innerText = message;
        }
        function setSuccessFor(input) {
            const formControl = input.parentElement;
            formControl.className = 'form-control success';
        }
        function isEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        }


    }

    if (url == "/RecordStoreBarFoo/vinyl.html") {

        ajaxCallBack("menu.json", function (rezultat) {
            ispisNavigacije(rezultat);

        })

        ajaxCallBack("footer.json", function (rezultat) {
            ispisFootera(rezultat);
        })
        ajaxCallBack("genre.json", function (rezultat) {
            genre = rezultat
            ispisGenre(genre);

            sacuvajLS("Genres", rezultat);

        })
        ajaxCallBack("sort.json", function (rezultat) {
            kreirajdropdownListu(rezultat, "ddlSort", "Sort:", "ispis-sort", "sort")
        })
        ajaxCallBack("vinylPage.json", function (rezultat) {
            vinyl = rezultat;
            ispisVinyla(vinyl);

            sacuvajLS("sviProizvodi", vinyl);

            const search = () => {
                const searchEl = document.getElementById('genreSearch');

                searchEl.addEventListener('keyup', (e) => {
                    const search = e.target.value.toLowerCase();

                    const filteredVinyl = vinyl.filter((v) => {
                        return v.artist.toLowerCase().indexOf(search) > -1;
                    });

                    ispisVinyla(filteredVinyl);

                });
            }
            search()

            $(document).on('click', '#genreList', (e) => {
                const selectedGenreId = $(e.target).data('id');

                if (!selectedGenreId) {
                    return ispisVinyla(vinyl)
                }

                const filteredByGenre = vinyl.filter((v) => {
                    return v.genreid === selectedGenreId;
                });

                ispisVinyla(filteredByGenre);

            })

            class CartItem {
                constructor(name, desc, img, price) {
                    this.name = name;
                    this.img = img;
                    this.desc = desc
                    this.price = price;
                    this.quantity = 1;
                }
            };
            class LocalCart {
                static key = 'cartItems';

                static getLocalCartItems() {
                    let cartMap = new Map()
                    const cart = localStorage.getItem(LocalCart.key);
                    if (cart == null || cart.length === 0) {
                        return cartMap;
                    }
                    return new Map(Object.entries(JSON.parse(cart)))

                }
                static addItemToLocalCart(id, item) {
                    let cart = LocalCart.getLocalCartItems()
                    if (cart.has(id)) {
                        let mapItem = cart.get(id);
                        mapItem.quantity += 1;
                        cart.set(id, mapItem);
                    }
                    else {
                        cart.set(id, item);
                    }
                    localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
                    updateCartUI();
                }
                static removeItemFromCart(id) {
                    let cart = LocalCart.getLocalCartItems()
                    if (cart.has(id)) {
                        let mapItem = cart.get(id)
                        if (mapItem.quantity > 1) {
                            mapItem.quantity -= 1;
                            cart.set(id, mapItem)
                        }
                        else {
                            cart.delete(id);
                        }
                    }
                    if (cart.length === 0) {
                        localStorage.clear()
                    }

                    else {
                        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
                        updateCartUI();
                    }

                }
            };

            const cartIcon = document.querySelector('.cart-box');
            const wholeCartWindow = document.querySelector('.whole-cart-window')
            const addToCartBttns = document.querySelectorAll('.add-cart')
            addToCartBttns.forEach((btn) => {
                btn.addEventListener('click', addItemFunction)
            })
            function addItemFunction(e) {
                const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
                const productData = vinyl[id];

                const name = productData.artist;
                const desc = productData.album;
                const img = productData.image;
                const price = productData.likes;


                const item = new CartItem(name, desc, img, price)
                LocalCart.addItemToLocalCart(id, item)

            }
            wholeCartWindow.inWindow = 0;
            cartIcon.addEventListener('mouseover', () => {
                if (wholeCartWindow.classList.contains('hide')) {
                    wholeCartWindow.classList.remove('hide');
                }
                cartIcon.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        if (wholeCartWindow.inWindow === 0) {
                            wholeCartWindow.classList.add('hide');
                        }
                    }, 500)
                    wholeCartWindow.classList.add('hide');
                })


            })
            wholeCartWindow.addEventListener('mouseover', () => {
                wholeCartWindow.inWindow = 1;
            })

            wholeCartWindow.addEventListener('mouseleave', () => {
                wholeCartWindow.inWindow = 0;
                wholeCartWindow.classList.add('hide')
            })

            function updateCartUI() {
                const cartWrapper = document.querySelector(".cart-wrapper")
                cartWrapper.innerHTML = "";
                const items = LocalCart.getLocalCartItems('cartItems')
                if (items === null) return;
                let count = 0;
                let total = 0;
                for (const [key, value] of items.entries()) {
                    const cartItem = document.createElement('div')
                    cartItem.classList.add('cart-item')
                    let price = value.price * value.quantity
                    count += 1;
                    total += price
                    cartItem.innerHTML = `
                            <img src="${value.img}"> 
                       <div class="details">
                           <h3>${value.name}</h3>
                           <p>${value.desc}
                            <span class="quantity">Quantity: ${value.quantity}</span>
                               <span class="price">Price: $ ${price}</span>
                           </p>
                       </div>
                       <div class="cancel"><i class="fas fa-window-close"></i></div>
                    
                    `
                    cartItem.lastElementChild.addEventListener('click', () => {
                        LocalCart.removeItemFromCart(key);
                    })
                    cartWrapper.append(cartItem)
                }
                if (count > 0) {
                    cartIcon.classList.add("non-empty")
                    let root = document.querySelector(':root')
                    root.style.setProperty('--after-content', `"${count}"`)
                    const subtotal = document.querySelector('.subtotal')
                    subtotal.innerHTML = `Subtotal: $${total}`


                }
                else {
                    cartIcon.classList.remove(".non-empty")
                }

            }
            document.addEventListener("DOMContentLoader", () => { updateCartUI })








        })

    }



}


$(document).on("change", "#ddlSort", promena);
function ispisProizvodanaIndexStraniciAlbum(niz) {
    let html = "";

    for (let item of niz) {
        html += `
        <div class="col-md-4">
                        <div class="card mb-4 box-shadow">
                            <img class="card-img-top"
                                src="${item.image}"
                                alt="Card image cap">
                            <div class="card-body">
                                <p class="card-text">${item.artist}</p>
                                <p class="card-text">${item.notes}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary"><a href="vinyl.html">Buy Now</a></button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary">Votes:${item.likes}</button>
                                    </div>
                                    <small class="text-muted">9 mins</small>
                                </div>
                            </div>
                        </div>
                    </div>
        
        `
    }
    document.querySelector(".ispis-Albuma").innerHTML = html;
}










function ispisNavigacije(niz) {
    let html = "";

    html += `<nav class="navbar navbar-expand-lg navbar-light  d-flex space-evenly background-color-black">`

    for (objNavigacije2 of niz) {
        if (objNavigacije2.slika)
            html += `<a class="navbar-brand" href="${objNavigacije2.href}">
        <img src="${objNavigacije2.slika}" width="30" height="30" alt="">`

    }
    `<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse " id="navbarNavAltMarkup">
      <div class="navbar-nav">`
    for (let objNavigacije of niz) {
        if (!objNavigacije.slika) {
            html += `<a class="nav-item nav-link active " href="${objNavigacije.href}">${objNavigacije.naziv}</a>`
        }

    }
    html += ` 
               
            </div></div></div></nav>`

    document.getElementById("ispis-navigacije").innerHTML = html;




}
function ispisCarouselProizvoda(niz) {

    let html = "";

    for (let objVinyl of niz) {
        html +=
            `<div class="owl-item mt-5">
                    <div class="slide-product owl-carousel-item">
                        <div class="product-grid-item" data-id="${objVinyl.id}"></div>
                            <div class="product-wrapper">
                                <div class="product-element-top">
                                    <img width="150px" height="200px" src="${objVinyl.artwork}"</img>
                                </div>
                            </div>
                            
                            <div class="quick-shop-wrapper">
                                <div class="quick-shop-form"></div>
                            </div>
                            <div class="product-element-bottom ">
                                <h3 class="font-size-15 ">${objVinyl.title}</h3>
                                <h3 class="font-size-18 siva-boja-slova">${objVinyl.artist}</h3>
                                <span class="price font-size-15">${objVinyl.price}$</span>
                            </div>
                            
                        </div>
                    </div>
        </div>`
    }
    document.querySelector(".owl-carousel").innerHTML = html;

    //     $('.owl-carousel').owlCarousel({
    //         loop:true,
    //         margin:3,
    //         nav:true,
    //         responsive:{
    //             0:{
    //                 items:1
    //             },
    //             600:{
    //                 items:3
    //             }
    //         }   
    // })

}
function ispisFootera(niz) {
    let html = "";
    html += `<footer>
            <div class="social"><a href="WebProgramiranje2Documentation.pdf"><i class="fa-solid fa-file"></i></a><a href="#"><i class="fa-brands fa-square-instagram"></i></a><a href="#"><i class="fa-brands fa-square-snapchat"></i></a><a href="#"><i class="fa-brands fa-square-twitter"></i></a><a href="#"><i class="fa-brands fa-square-facebook"></i></a></div>
            <ul class="list-inline">`
    for (let ojbFooter of niz) {
        html += `<li class="list-inline-item"><a href="${ojbFooter.href}">${ojbFooter.naziv}</a></li>`
    }


    html += `</ul>
            <p class="copyright">RecordStoreBarFoo</p>
        </footer>`

    document.querySelector(".footer-basic").innerHTML = html;
}

function ispisVinyla(niz) {
    let html = "";

    for (let item of niz) {
        html += `<article class="product gallery__type " data-id=${item.id}>
                <div class="product-container">
                     <img src="${item.image}" alt="${item.artist}" class="product-img img margin-left">
                  
                </div>
                <footer>
                    <p class="product-name">${item.artist}</p>
                    <p class="product-name">${item.album}</p>
                    <p class="product-name">Genre:${item.genre}</p>
                    <p class="product-name">${item.year}</p>
                    
                    <h4 class="product-price">Price:${item.likes}$</h4>
                    
                        <button class="product-cart-btn product-icon">
                        <i class="fa-solid fa-cart-shopping add-cart"></i>
                         </button>
                </footer>
            </article>`

    }
    document.querySelector(".products-container").innerHTML = html;

}
function kreirajdropdownListu(niz, idListe, labela, idDiv, tip) {
    let html = `<div class="form-group">
    <label class="form-label"><h4>${labela}</h4></label>
    <select class="form-select" id="${idListe}">
        <option value="0">Choose</option>`;
    for (let obj of niz) {
        if (tip == "sort") {
            html += `<option value="${obj.vrednost}">${obj.naziv}</option>`
        }
        else {
            html += `<option value="${obj.id}">${obj.naziv}</option>`
        }
    }
    html += `</select>
    </div>`;
    document.querySelector(`#${idDiv}`).innerHTML = html;
}
function ispisGenre(niz) {
    let innerData = niz.map((genre) => {
        return `<li data-class="${genre.name}" data-id="${genre.id}" class="active">${genre.name}</li>`
    }).join('');

    let html = `<ul id="genreList" class="filter__section">
            <li class="active">All</li>
            ${innerData}
        </ul>`;

    document.querySelector(".companies").innerHTML = html;
}

function muzika() {
    let input = document.getElementById("headshell");
    let audio = document.getElementById("player");
    input.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            audio.currentTime = 0;
            input.innerHTML = "Pause";
        }
        else {
            audio.pause();
            input.innerHTML = "Play";
        }
    });

}

function audioVolume(kolicina) {
    let changeVolume = document.getElementsByTagName("audio")[0];
    changeVolume.volume = kolicina;
}
function songList(niz) {
    let html = "";
    for (let pesma of niz) {
        html += `<source src="${pesma.url}" type="audio/mpeg"/>`;
    }
    document.getElementById("player").innerHTML = html;
}
function prebacivanje() {
    let dugmezaPrebacivanje = document.getElementById("dugmeZaPrebacivanje");
    let vrednostSrc = document.getElementsByTagName("source");

    dugmezaPrebacivanje.addEventListener("click", function () {



    })
}
function dohvatiIzLS(naziv) {
    return JSON.parse(localStorage.getItem(naziv));
}
function sacuvajLS(naziv, vrednost) {
    localStorage.setItem(naziv, JSON.stringify(vrednost));
}
function ispisNaziv(id, nazivLS) {
    let nizLS = dohvatiIzLS(nazivLS);

    let naziv = "";
    for (let obj of nizLS) {
        if (obj.id == id) {
            naziv = obj.naziv;
            break
        }
    }
    return naziv;
}
function promena() {
    let proizvodi = dohvatiIzLS("sviProizvodi");
    proizvodi = sortiranje(proizvodi);



    ispisVinyla(proizvodi);


}
function sortiranje(nizProizvoda) {

    let sortiraniProizvodi = [];
    let izbor = $("#ddlSort").val();

    if (izbor == "0") {
        sortiraniProizvodi = nizProizvoda;
    }
    else {
        sortiraniProizvodi = nizProizvoda.sort(function (a, b) {
            if (izbor == "cena-asc") {
                return a.likes - b.likes;
            }
            if (izbor == "cena-desc") {
                return b.likes - a.likes;
            }
            if (izbor == "naziv-asc") {
                if (a.artist < b.artist) {
                    return -1;
                }
                else if (a.artist > b.artist) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            if (izbor == "naziv-desc") {
                if (a.artist > b.artist) {
                    return -1;
                }
                else if (a.artist < b.artist) {
                    return 1;
                }
                else {
                    return 0;
                }
            }

        })
    }
    return sortiraniProizvodi;
}


