import router from './router.js';

import header from './widgets/header.js';
import search from './widgets/search.js';
import popup from './widgets/popup.js';
import msg from './widgets/msg.js';
import toggle from './widgets/toogle.js';
import img from './widgets/img.js';

document.addEventListener('DOMContentLoaded', function () {

    const main = {
        data() {
            return {
                url: "http://affiliate.yanbasok.com",
                user: { name: "", phone: "", email: "", date: "", auth: "" },
                formData: {},
                title: "",
                date: "",
                time: "",
            };
        },
        watch: {
            $route: function () {
                this.init();
            }
        },
        mounted: function () {
            this.init();
        },
        methods: {
            init() {
                const self = this;

                if (window.localStorage.getItem('user')) {
                    self.user = JSON.parse(window.localStorage.getItem('user'));
                }

                router.isReady().then(() => {
                    if (window.localStorage.getItem("user")) {
                        self.user = JSON.parse(window.localStorage.getItem("user"));

                        if (self.$route['path'] === '/' && self.user.type === 'admin') {
                            self.page("/campaigns");
                        } else if (['/campaigns', '/campaign', '/users', '/user'].includes(self.$route['path']) && self.user.type !== 'admin') {
                            self.page('/statistics');
                        } else if (['/statistics', '/payments', '/sites'].includes(self.$route['path']) && self.user.type === "admin") {
                            self.page("/campaigns");
                        } else if (!['/campaigns', '/campaign', '/users', '/user', '/statistics', '/payments', '/sites'].includes(self.$route['path'])) {
                            self.page("/");
                        }
                    }
                });
            },
            logout() {
                this.user = { name: "", phone: "", email: "", date: "", auth: "" };
                this.page('/');
                window.localStorage.setItem('user', '');
            },
            scrollTop() {
                setTimeout(function () {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 150);
            },
            scrollBottom() {
                setTimeout(function () {
                    window.scrollTo({
                        top: 1000,
                        behavior: 'smooth'
                    });
                }, 150);
            },
            page(path = "") {
                this.$router.replace(path);
                this.title = this.$route['name'];
                document.title = this.$route['name'];
            },
            toFormData(obj) {
                const fd = new FormData();

                for (const x in obj) {
                    if (typeof obj[x] === 'object' && x !== 'img' && x !== 'copy') {
                        for (const y in obj[x]) {
                            if (typeof obj[x][y] === 'object') {
                                for (const z in obj[x][y]) {
                                    fd.append(${x}[${y}][${z}], obj[x][y][z]);
                                }
                            } else {
                                fd.append(${x}[${y}], obj[x][y]);
                            }
                        }
                    } else if (x !== 'copy') {
                        fd.append(x, obj[x]);
                    }
                }

                return fd;
            }
        }
    };

    const app = Vue.createApp(main)
        .use(router)
        .mount('#content');
});