document.addEventListener('DOMContentLoaded', function(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmxvb3dlZW4iLCJhIjoiY2tzazM3aG5sMHI5NDJwb3hvODl0Y2c3bCJ9.j2qvpZh4S-zMybwgpKW_RA';
    const instance = tippy(document.getElementById('box'));
    instance.setProps({
        arrow: true,
        content: "<p class='m-0 p-0' style='color:white'><b>No hay ninguna bandera aún</b></p>",
        animation: 'scale',
        allowHTML:true,
        placement: 'bottom',
        trigger: 'click',   
    });
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [0, 15], // starting position [lng, lat]
        zoom: 1, // starting zoom
        style: 'mapbox://styles/mapbox/streets-v11' 
    });
    var marker;
    navigator.geolocation.getCurrentPosition(function(data){
        setTimeout(function(){
            marker = new mapboxgl.Marker({
                color: "red",
                draggable: true
            }).setLngLat([data.coords.longitude, data.coords.latitude, ]).addTo(map);
            moveTo(data.coords.longitude, data.coords.latitude);  
            
        },500);
    }, function(){
        marker = new mapboxgl.Marker({
            color: "red",
            draggable: true
        }).setLngLat([0, 0]).addTo(map);
    });
    $("body").on("keyup","#pais", function(e){ 
        if (e.key === 'Enter' || e.keyCode === 13){
            //$(".tippy-popper").remove();
            $("#bandera").remove();
            $("#error").remove();
            $("#box").append("<div class='loader'></div>");
            let pais = $("#pais").val();
            let url = "https://restcountries.com/v3.1/name/"+pais;
            fetch(url).then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.status != 404){
                    flag = data[0].flags.svg;
                    marker.remove();
                    marker = new mapboxgl.Marker({
                        color: "red",
                        draggable: true
                    }).setLngLat([data[0].latlng[1],data[0].latlng[0]]).addTo(map);
                    moveTo(data[0].latlng[1], data[0].latlng[0]);                 
                    $("#box").append("<img id='bandera' class='animate__animated animate__zoomIn animate__faster my-3' width='70%' height='auto' id='bandera_principal' src='"+flag+"' alt='Pais'></img>");
                    // 'Bandera de '+data[0].name.nativeName.ara
                    instance.setProps({
                        arrow: true,
                        content: "<p class='m-0 p-0' style='color:yellow'><b>"+data[0].name.official+"</b></p>",
                        animation: 'scale',
                        allowHTML:true,
                        placement: 'bottom',
                        trigger: 'click',
                    });
                }else{
                    $("#box").append("<p id='error'><b></b>Country not found</b></p>");
                    instance.setProps({
                        arrow: true,
                        content: "<p class='m-0 p-0' style='color:red'><b>Try again</b></p>",
                        animation: 'scale',
                        allowHTML:true,
                        placement: 'bottom',
                        trigger: 'click',   
                    });
                }
            }).finally(function(){
                $(".loader").remove();
            });

        }
    });
    function moveTo(lat, lon){
        marker.on('dragend', onDragEnd);
        map.flyTo({
            center: [lat,lon],
            zoom: 3,
            curve: 1,
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            easing(t) {
                return t;
            }
        });
        
    }
    function onDragEnd() {
        console.log(marker);

    }
});


