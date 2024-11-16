import{f as x,g as T,a as O,p as k,i as D,L as N,M as $,d as P,s as l,b as B}from"./date-gtU_td5v.js";import{d as C,r as m,c as I,o as M,a as R,b as L,e as d,t as h,f as s,w as p,u as n,n as g,g as U,_ as V}from"./index-DWIhrXV8.js";function z(c){const r=c.replace(/\D/g,""),o=r.startsWith("886")?r.slice(3):r;return(o.startsWith("4")?`0${o}`:o).replace(/(\d{2})(\d{8})/,"$1-$2")}function A(c){return c.replace(/^[^市]*(市)/,"").replace(/^\d{3}/,"").trim()}const E=["src","alt"],W=["href"],F=C({__name:"RestaurantsView",setup(c){const r=m(!0),o=m([]),u=m(null);function w(e){const i=k(e.OpenTime)??[];return{restaurantId:e.RestaurantID,restaurantName:e.RestaurantName,description:e.Description,address:A(e.Address),zipCode:e.ZipCode,phone:z(e.Phone),openTime:e.OpenTime,businessHours:i,isBusinessOpen:D(i),picture:{pictureUrl:e.Picture.PictureUrl1,pictureDescription:e.Picture.PictureDescription1},position:{longitude:e.Position.PositionLon,latitude:e.Position.PositionLat,geoHash:e.Position.GeoHash},city:e.City,srcUpdateTime:new Date(e.SrcUpdateTime),updateTime:new Date(e.UpdateTime)}}async function y(){var e;try{const i=T(),a=await O.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/Taichung?%24format=JSON",{headers:{"X-Forwarded-For":i}});console.log("response: ",a.data),o.value=((e=a.data)==null?void 0:e.map(t=>w(t)))??[],console.log("OpenTime",o.value.map(t=>t.openTime))}catch(i){console.error("Error:",i)}finally{r.value=!1}}async function _(){const i=await new N({apiKey:$,version:"weekly"}).load(),a=new i.maps.Map(u.value,{center:P,zoom:13});o.value.forEach(t=>{if(t.position.latitude&&t.position.longitude){const f=new i.maps.Marker({position:{lat:t.position.latitude,lng:t.position.longitude},map:a,title:t.restaurantName}),b=new i.maps.InfoWindow({content:`
        <div style="padding: 16px; max-width: 300px">
          <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a73e8">
            ${t.restaurantName}
          </h3>
          <p style="margin: 8px 0; color: #5f6368">
            <i class="pi pi-map-marker"></i> ${t.address}
          </p>
          <p style="margin: 8px 0; color: #5f6368">
            <i class="pi pi-phone"></i> ${t.phone}
          </p>
          <p style="margin: 8px 0; color: #5f6368">
            <i class="pi pi-clock"></i> ${t.openTime}
          </p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${t.position.latitude},${t.position.longitude}"
            target="_blank"
            style="display: inline-block; margin-top: 8px; color: #1a73e8; text-decoration: none"
          >
            在 Google Maps 導航 →
          </a>
        </div>
      `});f.addListener("click",()=>{b.open(a,f)})}})}const v=I(()=>o.value.length>0?x(o.value[0].updateTime):"");return M(async()=>{await y(),await _()}),(e,i)=>(R(),L("div",null,[d("div",{ref_key:"mapDiv",ref:u,style:{height:"500px","margin-bottom":"20px"}},null,512),d("p",null,"更新時間："+h(v.value),1),s(n(B),{value:o.value,loading:r.value,paginator:"",rows:100,sortField:"isBusinessOpen",sortOrder:-1},{default:p(()=>[s(n(l),{header:"圖片"},{body:p(a=>[d("img",{src:a.data.picture.pictureUrl,alt:a.data.picture.pictureDescription,style:{width:"100px",height:"100px","object-fit":"cover"}},null,8,E)]),_:1}),s(n(l),{field:"restaurantName",header:"餐廳名稱",sortable:""}),s(n(l),{field:"address",header:"地址",sortable:""}),s(n(l),{field:"phone",header:"電話"}),s(n(l),{field:"openTime",header:"營業時間"}),s(n(l),{header:"營業狀態",field:"isBusinessOpen",sortable:""},{body:p(a=>[d("span",{class:g(["status-badge",a.data.isBusinessOpen?"open":"closed"])},[d("i",{class:g(["pi",a.data.isBusinessOpen?"pi-check-circle":"pi-times-circle"])},null,2),U(" "+h(a.data.isBusinessOpen?"營業中":"已打烊"),1)],2)]),_:1}),s(n(l),{header:"導航"},{body:p(a=>[d("a",{href:`https://www.google.com/maps/dir/?api=1&destination=${a.data.position.latitude},${a.data.position.longitude}`,target:"_blank",class:"nav-link"}," GO ",8,W)]),_:1})]),_:1},8,["value","loading"])]))}}),S=V(F,[["__scopeId","data-v-fbdc2fa9"]]);export{S as default};
