var map;
//google map API
function initMap() {
    var x = document.getElementById('map');
    map = new google.maps.Map(x, {
        center: { lat: 41.89474, lng: 12.4839 },
        zoom: 18,
        mapTypeId: 'satellite'
    });
}

document.addEventListener("DOMContentLoaded", function () {

    //URL API
    const galleryAPI = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php"
    const paintingAPITemp = "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery="
    //arrays 
    const gallery = [];
    let paintings = [];
    let gallID = 0;


    //event handlers
    setUpListOfGallHandler()
    setUpSingleViewHandler()
    setUpButtonHandler()
    setUpBigViewHandler()
    setUpCloseBigViewHandler()
    setUpPlusHandler()
    setUpMinusHandler()
    sortArtist()
    sortTitle()
    sortYear()

    fetch(galleryAPI)
        .then(repsonse => repsonse.json())
        .then((data) => {
            gallery.push(...data),
                popNav()
            document.querySelector("#load1").style.display = "none";
        })
        .catch(err => console.log(err))


    function popNav() {
        list = document.querySelector('#gallList')
        for (g of gallery) {
            li = document.createElement('li')
            li.textContent = g.GalleryName
            list.appendChild(li)
        }

    }

    function setUpListOfGallHandler() {
        let oldE;
        document.querySelector('#gallList').addEventListener('click', function (e) {
            for (g of gallery) {
                if (e.target.textContent == g.GalleryName && e.target.nodeName == "LI") {
                    document.querySelector("#load2").style.display = "block";
                    paintingAPI = paintingAPITemp + g.GalleryID
                    e.target.style.backgroundColor = "#757575";
                    if (oldE != undefined) {
                        oldE.target.removeAttribute('style')
                    }
                    oldE = e
                    gallID = g.GalleryID;
                }
            }
            fetch(paintingAPI)
                .then(repsonse => repsonse.json())
                .then((data) => {
                    document.querySelector("#map").style.display = "block";
                    document.querySelector(".galleryInfo").style.display = "block";
                    document.querySelector(".paintings").style.display = "block";
                    document.querySelector("#load2").style.display = "none";
                    paintings = []
                    paintings.push(...data),
                        popGallInfo(),
                        popMap(),
                        popPaintings()
                })
                .catch(err => console.log(err))
        }
        )
    }
    function popGallInfo() {
        for (let g of gallery) {
            if (g.GalleryID == gallID) {
                document.querySelector('#galleryName').textContent = g.GalleryName;
                document.querySelector('#galleryNative').textContent = g.GalleryNativeName;
                document.querySelector('#galleryCity').textContent = g.GalleryCity;
                document.querySelector('#galleryAddress').textContent = g.GalleryAddress;
                document.querySelector('#galleryCountry').textContent = g.GalleryCountry;
                document.querySelector('#galleryWeb').textContent = g.GalleryWebSite;
                document.querySelector('#galleryWeb').setAttribute('href', g.GalleryWebSite);
            }
        }

    }
    function popMap() {
        for (let g of gallery) {
            if (g.GalleryID == gallID) {
                map.setCenter(new google.maps.LatLng(g.Latitude, g.Longitude))
            }
        }
    }

    const tab = document.querySelector('#tab');
    function popPaintings() {
        tab.innerHTML = ""
        const artist = paintings.sort((a, b) => {
            return a.LastName < b.LastName ? -1 : 1;
        })
        displayPaint(artist)
    }
    function displayPaint(sort) {
        tab.innerHTML = ""
        for (let i of sort) {
            tr = document.createElement('tr');
            img = document.createElement('img')
            img.setAttribute('src', "https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/" + i.ImageFileName)
            tdA = document.createElement('td')
            tdA.appendChild(img)
            tdB = document.createElement('td')
            tdB.textContent = i.LastName
            tdC = document.createElement('td')
            tdC.textContent = i.Title
            tdC.setAttribute('id', "title")
            tdC.setAttribute('alt', i.Title)
            tdD = document.createElement('td')
            tdD.textContent = i.YearOfWork

            tr.appendChild(tdA)
            tr.appendChild(tdB)
            tr.appendChild(tdC)
            tr.appendChild(tdD)
            tab.appendChild(tr)
        }
    }

    function sortArtist() {
        document.querySelector('#artH').addEventListener('click', function (e) {
            const artist = paintings.sort((a, b) => {
                return a.LastName < b.LastName ? -1 : 1;
            })
            displayPaint(artist);
        })
    }
    function sortTitle() {
        document.querySelector('#titleH').addEventListener('click', function (e) {
            const title = paintings.sort((a, b) => {
                return a.Title < b.Title ? -1 : 1;
            })
            displayPaint(title);
        })
    }
    function sortYear() {
        document.querySelector('#yearH').addEventListener('click', function (e) {
            const year = paintings.sort((a, b) => {
                return a.YearOfWork < b.YearOfWork ? -1 : 1;
            })
            displayPaint(year);
        })
    }

    function setUpSingleViewHandler() {
        const temp = document.querySelector("#template")
        document.querySelector('#paintTable').addEventListener('click', function (e) {
            if (e.target.getAttribute('id') == 'title') {
                document.querySelector(".galleryList").style.display = "none"
                document.querySelector(".singleView").style.display = "block"
                document.querySelector(".galleryInfo").style.display = "none"
                document.querySelector("#map").style.display = "none"
                document.querySelector(".paintings").style.display = "none"
                document.querySelector("#plus").style.display = "none"
                document.querySelector("#minus").style.display = "none"
                temp.innerHTML = ""
                for (let p of paintings) {
                    console.log(e.target.getAttribute('alt'))
                    if (e.target.getAttribute('alt') == p.Title) {
                        const fig = document.createElement("figure");
                        const img = document.createElement("img");
                        img.setAttribute('src', "https://res.cloudinary.com/funwebdev/image/upload/w_800/art/paintings/" + p.ImageFileName);
                        img.setAttribute('id', "bigimage")
                        fig.appendChild(img);
                        temp.appendChild(fig)

                        mod = document.querySelector('#large')
                        mod.innerHTML = ""
                        const modImg = document.createElement("img");
                        modImg.setAttribute('src', "https://res.cloudinary.com/funwebdev/image/upload/w_1500/art/paintings/" + p.ImageFileName);
                        modImg.setAttribute('id', "biggestImage")
                        mod.appendChild(modImg)

                        const figCap = document.createElement("figcaption");
                        figCap.setAttribute("id", "info")

                        const title = document.createElement("h2");
                        title.textContent = p.Title;
                        figCap.appendChild(title);

                        const artist = document.createElement("h3");
                        if (p.FirstName == null) {
                            artist.textContent = p.LastName;
                        }
                        else if (p.LastName == null) {
                            artist.textContent = p.FirstName;
                        }
                        else {
                            artist.textContent = p.FirstName + " " + p.LastName;
                        }
                        figCap.appendChild(artist);

                        const ul = document.createElement("ul")
                        const l1 = document.createElement("li");
                        const l2 = document.createElement("li");
                        const l3 = document.createElement("li");
                        const l4 = document.createElement("li");
                        const l5 = document.createElement("li");
                        const l6 = document.createElement("li");
                        const l7 = document.createElement("li");
                        const l8 = document.createElement("li");
                        const a = document.createElement("a");
                        const l9 = document.createElement("li");
                        l1.textContent = "Year of work: " + p.YearOfWork;
                        l2.textContent = "Medium: " + p.Medium;
                        l3.textContent = "Width: " + p.Width;
                        l4.textContent = "Height: " + p.Height;
                        l5.textContent = "Copyright: " + p.CopyrightText;
                        l6.textContent = "Gallery Name: " + p.GalleryName;
                        l7.textContent = "Gallery city: " + p.GalleryCity;
                        a.textContent = p.MuseumLink;
                        a.setAttribute('href', p.MuseumLink)
                        l8.setAttribute('id', 'link')
                        l9.textContent = p.Description;
                        l9.setAttribute('id', 'des')

                        l8.appendChild(a)

                        ul.appendChild(l1)
                        ul.appendChild(l2)
                        ul.appendChild(l3)
                        ul.appendChild(l4)
                        ul.appendChild(l5)
                        ul.appendChild(l6)
                        ul.appendChild(l7)
                        ul.appendChild(l8)
                        ul.appendChild(l9)

                        figCap.appendChild(ul)
                        for (let c of p.JsonAnnotations.dominantColors) {
                            span = document.createElement('span')
                            console.log(c.color.red)
                            span.style.backgroundColor = "rgb(" + c.color.red + "," + c.color.green + "," + c.color.blue + ")"
                            span.setAttribute('title', "Name: " + c.name + " HEX: " + c.web)
                            figCap.appendChild(span)
                        }

                        fig.appendChild(figCap)
                        temp.appendChild(fig)

                    }
                }
            }


        })
    }

    function setUpButtonHandler() {
        document.querySelector("#Close").addEventListener('click', function (e) {
            console.log('test')
            document.querySelector(".singleView").style.display = "none"
            document.querySelector(".galleryList").style.display = "block"
            document.querySelector(".galleryInfo").style.display = "block"
            document.querySelector("#map").style.display = "block"
            document.querySelector(".paintings").style.display = "block"
            if (sign = true) {
                document.querySelector("#plus").style.display = "none"
                document.querySelector("#minus").style.display = "block"
            }
            else {
                document.querySelector("#plus").style.display = "block"
                document.querySelector("#minus").style.display = "none"
            }
        })
    }

    function setUpBigViewHandler() {
        document.querySelector('#template').addEventListener('click', function (e) {
            if (e.target.nodeName == "IMG") {
                document.querySelector(".singleView").style.display = "none"
                document.querySelector(".header").style.display = "none"
                document.querySelector(".mod").style.display = "block"
            }
        })
    }

    function setUpCloseBigViewHandler() {
        document.querySelector('#exit').addEventListener('click', function (e) {
            document.querySelector(".singleView").style.display = "block"
            document.querySelector(".header").style.display = "block"
            document.querySelector(".mod").style.display = "none"
        })
    }

    function setUpPlusHandler() {
        document.querySelector("#plus").addEventListener('click', function (e) {
            document.querySelector("#plus").style.display = "none"
            document.querySelector("#minus").style.display = "block"
            document.querySelector(".galleryList").style.display = "block"
            sign = true
        })
    }

    function setUpMinusHandler() {
        document.querySelector("#minus").addEventListener('click', function (e) {
            document.querySelector("#plus").style.display = "block"
            document.querySelector("#minus").style.display = "none"
            document.querySelector(".galleryList").style.display = "none"
            sign = false
        })
    }

})