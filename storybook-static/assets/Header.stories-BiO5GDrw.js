import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as j}from"./Badge-DEuHeGQz.js";import{I as v}from"./IconButton-CoE3UwQk.js";import{H as s}from"./ListingCard-CSh2GMS3.js";import{G as H,M as y}from"./menu-BuHnPktf.js";import"./index-DwQS_Y10.js";import"./heart-YVLjfoYM.js";import"./createLucideIcon-Dn7aSrF3.js";const a=[{label:"Homes",iconUrl:"https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/049c1522-ce42-4a6a-9fe2-74ddbee53971.png"},{label:"Experiences",iconUrl:"https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ec4befb5-f8d2-460c-bd98-9e3d5a3e16e8.png"},{label:"Services",iconUrl:"https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/3e65e158-8c5e-4f56-9efa-9a9faa7db084.png"},{label:"Time Travel",iconUrl:"https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/9be8222d-7ffa-4c1a-a97f-6b3ed6400a37.png"}],t=e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx(j,{variant:"ghost",size:"md",children:"Become a host"}),e.jsx(v,{ariaLabel:"Language",icon:e.jsx(H,{size:20,strokeWidth:2})}),e.jsx(v,{ariaLabel:"Menu",icon:e.jsx(y,{size:20,strokeWidth:2})})]}),U={title:"Patterns/Header",component:s,tags:["autodocs"],parameters:{layout:"fullscreen"},argTypes:{activeNavLabel:{control:"select",options:["Homes","Experiences","Services","Time Travel",void 0]},onNavClick:{action:"navClicked"}}},i={args:{navItems:a,activeNavLabel:"Time Travel",rightSlot:t}},r={args:{navItems:a,activeNavLabel:"Homes",rightSlot:t}},o={args:{navItems:a,activeNavLabel:"Experiences",rightSlot:t}},c={args:{navItems:a,activeNavLabel:"Services",rightSlot:t}},l={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:8,fontSize:12,color:"#717171"},children:"Time Travel active"}),e.jsx(s,{navItems:a,activeNavLabel:"Time Travel",rightSlot:t})]}),e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:8,fontSize:12,color:"#717171"},children:"Homes active"}),e.jsx(s,{navItems:a,activeNavLabel:"Homes",rightSlot:t})]}),e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:8,fontSize:12,color:"#717171"},children:"Experiences active"}),e.jsx(s,{navItems:a,activeNavLabel:"Experiences",rightSlot:t})]}),e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:8,fontSize:12,color:"#717171"},children:"Services active"}),e.jsx(s,{navItems:a,activeNavLabel:"Services",rightSlot:t})]})]})},n={args:{navItems:a,activeNavLabel:void 0,rightSlot:t}};var m,d,g;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Time Travel',
    rightSlot: defaultRightSlot
  }
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var p,S,h;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Homes',
    rightSlot: defaultRightSlot
  }
}`,...(h=(S=r.parameters)==null?void 0:S.docs)==null?void 0:h.source}}};var u,f,I;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Experiences',
    rightSlot: defaultRightSlot
  }
}`,...(I=(f=o.parameters)==null?void 0:f.docs)==null?void 0:I.source}}};var x,b,N;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Services',
    rightSlot: defaultRightSlot
  }
}`,...(N=(b=c.parameters)==null?void 0:b.docs)==null?void 0:N.source}}};var T,A,M;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  }}>
      <div>
        <div style={{
        marginBottom: 8,
        fontSize: 12,
        color: '#717171'
      }}>Time Travel active</div>
        <Header navItems={FIGMA_NAV_ITEMS} activeNavLabel="Time Travel" rightSlot={defaultRightSlot} />
      </div>
      <div>
        <div style={{
        marginBottom: 8,
        fontSize: 12,
        color: '#717171'
      }}>Homes active</div>
        <Header navItems={FIGMA_NAV_ITEMS} activeNavLabel="Homes" rightSlot={defaultRightSlot} />
      </div>
      <div>
        <div style={{
        marginBottom: 8,
        fontSize: 12,
        color: '#717171'
      }}>Experiences active</div>
        <Header navItems={FIGMA_NAV_ITEMS} activeNavLabel="Experiences" rightSlot={defaultRightSlot} />
      </div>
      <div>
        <div style={{
        marginBottom: 8,
        fontSize: 12,
        color: '#717171'
      }}>Services active</div>
        <Header navItems={FIGMA_NAV_ITEMS} activeNavLabel="Services" rightSlot={defaultRightSlot} />
      </div>
    </div>
}`,...(M=(A=l.parameters)==null?void 0:A.docs)==null?void 0:M.source}}};var E,L,_;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: undefined,
    rightSlot: defaultRightSlot
  }
}`,...(_=(L=n.parameters)==null?void 0:L.docs)==null?void 0:_.source}}};const C=["Default","HomesActive","ExperiencesActive","ServicesActive","ActiveTabVariants","NoActiveTab"];export{l as ActiveTabVariants,i as Default,o as ExperiencesActive,r as HomesActive,n as NoActiveTab,c as ServicesActive,C as __namedExportsOrder,U as default};
