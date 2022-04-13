//can be used without class (i.e. by normal function)

class Container{
    constructor () {
        this.API_KEY = "563492ad6f91700001000001c897ad87fba5405fb2e0849ddc5bca27";
        this.Images = document.querySelector('.gallery');
        this.Search = document.querySelector('.header');
        this.load = document.querySelector('.load');
        this.eventHandle();
        this.pageIndex = 1;
        this.searchValueGlobal='';
        
    }

    eventHandle() {
        document.addEventListener('DOMContentLoaded', () => {
            this.getImg();
        });

        this.Search.addEventListener('submit', (e) => {
            this.getSearchedImages(e);
        })

        this.load.addEventListener('click', (e)=> {
            this.loadMore(e)
        })
    }

    //fetching image from api
    async getImg(index) {
        this.load.setAttribute('data-img','curated')
        console.log(index)
        const baseUrl= `https://api.pexels.com/v1/curated?page=${index}&per_page=6`;
        const data = await this.fetchImages(baseUrl);
        this.GenerateHTML(data.photos); 
        console.log(data)

    }

    //fetch response
    async fetchImages(baseUrl) {
        const response = await fetch(baseUrl, {
            // method:'GET',
            // headers:{
            //     Accept: 'application.json',
            //     Authorization: this.API_KEY
            // }
        });

        const data = await response.json();
        return data;
    }

    //image div container
    GenerateHTML(photos) {
        photos.forEach( photo => {
            const item = document.createElement('div');
            item.classList.add('item');
            
            item.innerHTML = `
            <a href='#'>
                <img src="${photo.src.original}"/>            
                <h3>${photo.photographer}</h3>
            </a>
            `;
            this.Images.appendChild(item);
        });
    }

    //searched images
    async getSearchedImages(e) {
        this.load.setAttribute('data-img', 'search')
        e.preventDefault();
        this.Images.innerHTML=''
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue
        const searchURL =  `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=6`;
        const data = await this.fetchImages(searchURL);
        this.GenerateHTML(data.photos);
        e.target.reset()
    }

    //more searched images function
    async getMoreImages(index) {
        const searchedValue = this.Search.querySelector('input').value;
        const searchURL =  `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=6`;
        const data = await this.fetchImages(searchURL);
        this.GenerateHTML(data.photos);
    }

    // extra images loaded
    async loadMore(e){
        let index = ++this.pageIndex;
        const loadMoreImage = e.target.getAttribute('data-img');
        if(loadMoreImage === 'curated'){
            this.getImg(index)
        }
        else {
            this.getMoreImages(index);
        }
    }
}

const gallery = new Container;

