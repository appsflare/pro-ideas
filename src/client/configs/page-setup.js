export default function SetupPage() {
    const title = "Lot Of Ideas - One place to share and track ideas";
    const metaInfos = [{ charset: "utf-8" },
    { name: "description", content: "An realtime dashboard application to share and track ideas" },
    { name: "viewport", content: "user-scalable=no, initial-scale=1, minimal-ui, maximum-scale=1, minimum-scale=1" }
    ];
    const links = [
        { rel: "shortcut icon", type: "image/png", href: "favicon.png?v1", sizes: "16x16 32x32 64x64" },
        //<!-- Material Design fonts -->
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons", type: "text/css" },        
        
        { rel: "stylesheet", href: "/styles/animate.css" },
        //<!-- Font Awesome -->
        { rel: "stylesheet", href: "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" },
        // <!-- Ionicons -->
        { rel: "stylesheet", href: "//cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" }
    ];

    DocHead.setTitle(title);

    metaInfos.forEach(m => DocHead.addMeta(m));

    links.forEach(link => DocHead.addLink(link));
}