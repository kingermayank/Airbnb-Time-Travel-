import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as p}from"./SectionTitle-OUIKQWJq.js";import"./IconButton-CMgH9GM-.js";import{H as v}from"./UserMenu-zY8MeJtX.js";import"./index-BCtMShv3.js";import{c as l}from"./createLucideIcon-CJ_m3CD5.js";import"./search-De7yGF5O.js";/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],g=l("circle-question-mark",b);/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 18h16",key:"19g7jn"}],["path",{d:"M4 6h16",key:"1o0s65"}]],h=l("menu",u),N=""+new URL("mindscapes-CdSAJHk2.png",import.meta.url).href,M="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets",f=`${M}/9be8222d-7ffa-4c1a-a97f-6b3ed6400a37.png`,S=N,d=[{label:"Time Travel",iconUrl:f},{label:"Mindscapes",iconUrl:S,disabled:!0}],m=e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx(p,{variant:"ghost",size:"md",style:{color:"var(--ds-navbar-active)"},children:"Become a host"}),e.jsx("button",{type:"button",className:"ds-header-right-icon-btn","aria-label":"Help",children:e.jsx(g,{size:20,strokeWidth:2,style:{color:"var(--ds-navbar-active)"}})}),e.jsx("button",{type:"button",className:"ds-header-right-icon-btn","aria-label":"Menu",children:e.jsx(h,{size:20,strokeWidth:2,style:{color:"var(--ds-navbar-active)"}})})]}),j={title:"Patterns/Header",component:v,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:"Header navigation from Figma 307-4788 (pixel-accurate). Brand: warpbnb. Nav: Time Travel (active), Mindscapes (coming soon). Right: Become a host, Help, Menu."}}},argTypes:{brandName:{control:"text"},activeNavLabel:{control:"select",options:["Time Travel",void 0]},onNavClick:{action:"navClicked"}}},a={args:{brandName:"warpbnb",navItems:d,activeNavLabel:"Time Travel",rightSlot:m}},t={args:{brandName:"warpbnb",navItems:d,activeNavLabel:void 0,rightSlot:m}};var r,o,s;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    brandName: 'warpbnb',
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Time Travel',
    rightSlot: defaultRightSlot
  }
}`,...(s=(o=a.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};var n,i,c;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    brandName: 'warpbnb',
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: undefined,
    rightSlot: defaultRightSlot
  }
}`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};const E=["Default","NoActiveTab"];export{a as Default,t as NoActiveTab,E as __namedExportsOrder,j as default};
