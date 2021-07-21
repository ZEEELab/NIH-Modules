// import React useEffect and useState (useState currently not used)
import React, {useEffect, useState, useRef} from 'react';

import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import { Link } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";

// import GSAP and necessary plugins
import {gsap, CSSPlugin} from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import styles
import './Mod2Styles.css';

// import d3
import * as d3 from "d3";
// import two functions: determineSIR and addTiles from external JS sources
import {determineSIR, determineSIRPerp} from 'utilityfunctions/determineSIR.js'
import {addTiles, addTilesHorizontal} from 'utilityfunctions/addTiles.js'


export default function Module2() {

  // CONSTANTS //
  // headers and text descriptions:
  const headerStartSus = "Begin as Susceptible";
  const startSus = "Professor F begins by being susceptible to a disease."

  const headerBecomeInf = "Interacting with Infectious"
  const becomeInf = "As they move about in their life, they may interact with someone who is infected with an agent — an infectious person"

  const headerWhenInf = "Becoming Infected"
  const whenInf = 'From this chance encounter, Professor F becomes infected with the illness too. Soon, Professor F begins to feel ill, and passes from the "susceptible" state to the "infected/ill" state'

  const headerStaySick = "Remaining Ill and Infectious"
  const staySick = 'Professor F will remain ill and infectious for a particular number of days that is specific to their illness'

  const headerBecomeRec = "Recovering from the Illness"
  const becomeRec = 'After a certain number of days, Professor F is no longer sick: their body has healed and they are now considered "recovered" — not able to get the illness again. They will stay in the removed state for the rest of their life.'
  
  // letters on top of tiles
  // base = no letter
  const sirBase= ""

  // The attribute 'd' for SVG path that forms the letter S on top of a tile
  const sirS = "M156.1,37.3c-7.8-4.6-16.6-7.4-25.7-8c-8.8-0.5-16.7,1.2-23.6,5.2c-5.5,3.2-8.6,6.8-9.4,10.8 c-0.8,4,1,9.1,5.6,15.3c4.4,5.9,6.7,10.2,6.9,12.8c0.2,2.6-1.2,4.8-4.3,6.6c-3.7,2-7.8,2.9-12,2.5c-4.6-0.3-9.5-2-14.9-5.1 c-3.7-2.2-7.2-4.8-10.3-7.7c-3-2.8-5.6-5.9-7.9-9.3l-12.7,7.4c3.1,5.1,9.3,10.4,18.7,15.8c8.6,5.2,18.3,8.3,28.2,9.1 c9.5,0.7,17.9-1.1,25.2-5.4c3.7-2.2,6.3-4.4,7.7-6.8c1.4-2.4,1.8-5.2,1.1-7.9c-0.7-2.9-2.8-6.8-6.3-11.8c-3.2-4.4-5.1-7.6-5.9-9.6 c-0.7-1.6-0.8-3.4-0.2-5.1c0.9-1.7,2.4-3.1,4.1-4c3.3-1.9,7.1-2.7,10.9-2.4c4.5,0.3,8.9,1.7,12.8,4.1c6,3.5,11.1,8.3,15.1,14.1 l15.3-3.9C169.7,47.1,163.4,41.4,156.1,37.3"

  // The attribute 'points' for SVG polyline that forms the letter I on top of a tile
  const sirI = "154.3,39.7 140.8,31.9 58.5,79.7 72.1,87.5 154.3,39.7"

  // The attribute 'd' for SVG path that forms the letter R on top of a tile
  const sirR = "M100.9,53.9l26.9-15.6l9,5.2c6.2,3.6,9.7,6.8,10.8,9.7c1,2.9-0.8,5.8-5.4,8.5  c-4.4,2.6-9.5,3.9-14.6,3.6c-5.1-0.3-10.9-2.2-17.2-5.9L100.9,53.9 M149,37.3l-23.4-13.5L43.4,71.6l13.5,7.8l32.9-19.1l13.4,7.7  l-13,30.5l15.4,8.9l13-34.7c15.1,3.7,27.7,2.5,38-3.4c8-4.7,11.4-9.6,10.3-14.9C165.7,49.2,159.8,43.5,149,37.3"
  
  // useState to set if figure is on S, I, or R
  // const [stepSIR, setSIR] = useState(sirBase);

  // useRef to make sure each page loads its own content
  const ref = useRef(null)

  useEffect(() => {
    // bump position to top of page
    window.scrollTo(0, 0)

    // the plugins to be used:
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(CSSPlugin);

    // refresh scrolltrigger (supposedly helps prevent funkiness)
    ScrollTrigger.refresh();

    // grab the current content
    const elem = ref.current

    // place entire scene in correct position:
    gsap.to(elem.querySelector("#init_scene"), {scaleX: 2.6, scaleY: 2.6, x:40, y: 0});


    // place things in the correct position and scale them if needed:
    // the tiles are moved:
    gsap.set(elem.querySelector(".tilegroup"),{x:0, y:20})
    // the spotlight is moved and scaled:
    gsap.set(elem.querySelector("#spotlight"), {x:-40 , y:-100, scaleX:.8, scaleY:.8})
    // the spotlight and person are moved:
    gsap.set(elem.querySelector(".full_person"),{x: -80, y: 0, scaleX:.6, scaleY: .6})    

    // set the figure back to "susceptible" body state
    determineSIR("susceptible")    
    
    // create a timeline that moves the legs:
    let m2_legs_walking_tl = gsap.timeline({
      repeat: 20, 
      scrollTrigger: {
        trigger: "#module2markers",
        markers: true,
        scrub: true
      }
    })

    m2_legs_walking_tl.addLabel("move_legs_1")
      .to(".left_leg_group", {
        // duration:15, 
        rotation:15}, "move_legs_1")
      .to(".right_leg_group", {
        // duration:15, 
        rotation:-15}, "move_legs_1")

    m2_legs_walking_tl.addLabel("move_legs_2")
      .to(".left_leg_group", {
        // duration:15, 
        rotation:-15}, "move_legs2")
      .to(".right_leg_group", {
        // duration:15, 
        rotation:15 }, "move_legs2")

    m2_legs_walking_tl.addLabel("move_legs_0")
      .to(".left_leg_group", {
        // duration:5, 
        rotation:0, ease: "none"}, "move_legs_0")
      .to(".right_leg_group", {
        // duration:5, 
        rotation:0, ease: "none"}, "move_legs_0")
  
    // create a timeline that moves the legs for the perpendicular person:
    var wg_legs_walking_tl = gsap.timeline({
      repeat: 20, 
      scrollTrigger: {
        trigger: '#module2markers',
        // trigger: "#step_5",
        markers: true,
        scrub: true
      }
    });
    wg_legs_walking_tl.addLabel("move_legs_1")
      .to("#wg_left_leg_group", {
        // duration:1, 
        rotation:15}, "move_legs_1")
      .to("#wg_right_leg_group", {
        // duration:1, 
        rotation:-15}, "move_legs_1")

    wg_legs_walking_tl.addLabel("move_legs_2")
      .to("#wg_left_leg_group", {
        // duration:1, 
        rotation:-15}, "move_legs2")
      .to("#wg_right_leg_group", {
        // duration:1, 
        rotation:15 }, "move_legs2")

    wg_legs_walking_tl.addLabel("move_legs_0")
      .to("#wg_left_leg_group", {
        // duration:1, 
        rotation:0, ease: "none"}, "move_legs_0")
      .to("#wg_right_leg_group", {
        // duration:1, 
        rotation:0, ease: "none"}, "move_legs_0")



    // initialize a mater timeline to add other tweens and timelines to:
    var master_tl = gsap.timeline();
    

    // because we want a long path for module 2, let's scale down tiles
    // let's also scale down the human
    
    // add tiles to SVG so there are 10 total tiles
    addTiles("moduleSvg", 10)
    let allTiles2 = gsap.utils.toArray(".tile")

    // programmatically set each tile the correct distance apart
    for (let i=0; i < allTiles2.length; i++){
      let myX = 0
      let myY = 360
      let scale = 1.2
      let xIncrement = 90 * 1.5 * scale
      let yIncrement = 50 * 1.5 * scale
      gsap.set(allTiles2[i],{
        x: myX + xIncrement*i,
        y: myY + yIncrement*i,
        scaleX: scale,
        scaleY: scale,
      })
    }
              
    // add tiles perpendicularly
    addTilesHorizontal("moduleSvg", 8)

    let allTilesH = gsap.utils.toArray(".tileH")

    for (let i=0; i < allTilesH.length; i++){
      // myX and myY are set as the initial values of 0 and 360
      // plus the extra x and y distance
      // of the 5th tile down
      // this aligns the perpendicular path
      // with the correct tile
      let myX = 0 + (90 * 1.5 * 1.2 * 4)
      let myY = 360 + (50 * 1.5 * 1.2 * 4)
      let scale = 1.2
      let xIncrement = 90 * 1.5 * scale
      let yIncrement = -50 * 1.5 * scale
      
      // this code animates each tile:
      // if it's the an even tile, we add it 
      // to the left of the existing path
      // else, we add it to the right
      gsap.to(allTilesH[i],{
          x: () => {
            if (i % 2 === 0){
              // console.log("i math at even", (i/2))
              return  myX + (xIncrement*(i/2))
            } else {
              // console.log("i math at odd", (i-1)/2 + 1)
              return myX - xIncrement*((i-1)/2 + 1)
            }
          },
          y: () => {
            if (i % 2 === 0){
              return  myY + (yIncrement*(i/2))
            } else {
              return myY - yIncrement*((i-1)/2 + 1)
            }
          } ,
          scaleX: scale,
          scaleY: scale,
        })
    }

    // position the person on the perpendicular
    gsap.set(elem.querySelector(".perpendicularPerson"),{
      x: 380, y: 0, scaleX:.6, scaleY: .6
    })

    let moving_tl = gsap.timeline().paused(true)
    // move the person on the perpendicualr
    moving_tl.to(elem.querySelector('.perpendicularPerson'), {
      scrollTrigger:{
        trigger: "#module2markers",
        start: "top 180",
        end: "+=2600",
        // onEnter: ()=>{wg_legs_walking_tl.play()},
        markers: true,
        scrub: true,
      },
      x:200,
      y:130,
      ease: "none",
    });    
    // create a tween that moves the person and spotlight (full person) 
    // to the correct end position for Module 2

    //Move from Start to Intersection with infected 
    //TODO Pause legs when here. 
    moving_tl.to(elem.querySelector('.full_person'), {
      scrollTrigger: {
        trigger: "#module2markers",
        start: "top 180",
        end: "+=2600",
        // onEnter: ()=>{legs_walking_tl.play(); master_tl.add(legs_walking_tl); },
        // onLeave: ()=>{master_tl.remove(legs_walking_tl)},
        // onEnterBack: ()=>{},
        // onLeaveBack: ()=>{legs_walking_tl.pause(); },
        scrub: true,
        // pin: true,
        markers: true,
      },
      x:200,
      y:180,
      ease: "none"
    });

    moving_tl.add(m2_legs_walking_tl)
    moving_tl.add(wg_legs_walking_tl)
    master_tl.add(moving_tl)

    // create a tween that updates the text based on scroll position
    // this tween also pauses and plays the legs walking
    // it also updates the SVG for the person depending on SIR state
    // for module 2
    master_tl.to(elem.querySelector("#moduleSvg"), {
      scrollTrigger: {
        trigger: "#module2markers",
        start: "top 180",
        end: "+=2600",
        onUpdate: () => {        
          const currScroll = window.scrollY + 160;
          const step_5 = elem.querySelector("#step_5") 
          const step_6 = elem.querySelector("#step_6")
          const step_7 = elem.querySelector("#step_7")   
          const step_8 = elem.querySelector("#step_8")
          const step_9  = elem.querySelector("#step_9")
          const step_buffer = elem.querySelector("#step_buffer")

          if (currScroll <= step_5.offsetTop){
            resetTileColors()
          } else if (currScroll > step_5.offsetTop && currScroll < (step_5.offsetTop + step_5.offsetHeight)) {
            //scroll is within step 5
            if (currScroll >= (step_5.offsetTop + step_5.offsetHeight)/2  && currScroll < (step_5.offsetTop + step_5.offsetHeight)){
              // console.log("hello i'm here")

              determineTileColor("#tileH1", "infected")
              determineTileColor("#tileH3", "infected")
              determineTileColor("#tileH5", "infected")  

              determineSIR("susceptible")
              determineSIRPerp("infectious")
            } else {
                determineTileColor("#tileH7", "susceptible")

                determineTileColor("#tile1", "susceptible")   
                determineTileColor("#tile2", "susceptible")   
                determineTileColor("#tile3", "susceptible")   
                determineTileColor("#tile4", "susceptible")

                elem.querySelector("#scrollText").textContent = startSus;
                elem.querySelector("#scrollHeader").textContent = headerStartSus;
                    
                determineSIR("susceptible")
                determineSIRPerp("susceptible")
            }

          } else if (currScroll >= step_6.offsetTop && currScroll < (step_6.offsetTop + step_6.offsetHeight)) {
            moving_tl.pause()
            console.log("tl paused at 6?", moving_tl.paused())

            determineTileColor("#tileH1", "infected")
            determineTileColor("#tileH3", "infected")
            determineTileColor("#tileH5", "infected")  
            determineTileColor("#tile5","infected")
            determineTileColor("#tile6","infected")
            determineTileColor("#tile7","infected")
            // scroll is within step 6
            elem.querySelector("#scrollText").textContent = becomeInf;
            elem.querySelector("#scrollHeader").textContent = headerBecomeInf;
            // legs_walking_tl.pause();

            determineSIRPerp("infectious")


          } else if (currScroll >= step_7.offsetTop && currScroll < (step_7.offsetTop + step_7.offsetHeight)){
            elem.querySelector("#scrollText").textContent = whenInf;
            elem.querySelector("#scrollHeader").textContent = headerWhenInf;
            determineSIR("infectious")
            determineSIRPerp("infectious")

            if (currScroll >= (step_7.offsetTop + step_7.offsetHeight)/2  && currScroll < (step_7.offsetTop + step_7.offsetHeight)){
              // console.log("hello i need to be recovered")
              console.log("tl paused at 7?",moving_tl.paused())
              determineSIRPerp("recovered")
              determineTileColor("#tileH2", "recovered")
              determineTileColor("#tileH4", "recovered")
              determineTileColor("#tileH6", "recovered")
              determineTileColor("#tileH8", "recovered")

              determineTileColor("#tile5","infected")
              determineTileColor("#tile6","infected")
              determineTileColor("#tile7","infected")
              determineTileColor("#tileH1", "infected")
              determineTileColor("#tileH3", "infected")
              determineTileColor("#tileH5", "infected")  
            } else {

                determineTileColor("#tile5","infected")
                determineTileColor("#tile6","infected")
                determineTileColor("#tile7","infected")

            }

          } else if (currScroll >= step_8.offsetTop && currScroll < (step_8.offsetTop + step_8.offsetHeight)){
            // moving_tl.resume()
            determineSIR("infectious")
            determineSIRPerp("recovered")
            
            elem.querySelector("#scrollText").textContent = staySick;
            elem.querySelector("#scrollHeader").textContent = headerStaySick;

          } else if (currScroll >= step_9.offsetTop && currScroll < (step_8.offsetTop + step_9.offsetHeight)){
          // transition in the contents
          elem.querySelector(".scrollTextContainer").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;"
          elem.querySelector("#init_scene").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;" 
          elem.querySelector(".tilegroup").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;"

            determineSIR("recovered")
            determineTileColor("#tile8", "recovered")
            determineTileColor("#tile9", "recovered")
            determineTileColor("#tile10", "recovered")

            elem.querySelector("#scrollText").textContent = becomeRec;
            elem.querySelector("#scrollHeader").textContent = headerBecomeRec;
          } else if (currScroll >=step_buffer.offsetTop){
            // transition out the contents
            elem.querySelector(".scrollTextContainer").style = " opacity : 0; transition:opacity .5s;"
            elem.querySelector("#init_scene").style = " opacity : 0; transition:opacity .5s;" 
            elem.querySelector(".tilegroup").style = " opacity : 0; transition:opacity .5s;" 

          }
        },
        onEnter: () => {
        // transition in the contents
        elem.querySelector(".scrollTextContainer").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;"
        elem.querySelector("#init_scene").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;" 
        elem.querySelector(".tilegroup").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;"
        
        },
        onLeave: () =>{
          // elem.querySelector(".scrollTextContainer").style = " opacity : 0; transition:opacity .5s; -webkit-transition: opacity .5s;"
          // elem.querySelector("#init_scene").style = " opacity : 0; transition:opacity 2s; -webkit-transition: opacity 2s;" 
          // elem.querySelector(".tilegroup").style = " opacity : 0; transition:opacity 2s; -webkit-transition: opacity 2s;"
          // elem.querySelector(".perpendicularPerson").style="visibility: hidden;" 
        },
        onEnterBack: () => {
          // transition in the contents
          elem.querySelector(".scrollTextContainer").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;"
          elem.querySelector("#init_scene").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;" 
          elem.querySelector(".tilegroup").style = " opacity : 1; transition:opacity .5s; -webkit-transition: opacity .5s;"
          },
        scrub: true,
        markers: true,
        // pinSpacing: true
      },
    }); 

    function determineTileColor(tileID, status){
      if (status == "susceptible"){
          d3.selectAll(`${tileID} > .letterR`).remove()
          d3.selectAll(`${tileID} > .letterI`).remove()
          d3.select(`${tileID}`).append("path").attr("d", sirS).attr('class','letterS')

          // update the tile colors
          d3.select(`${tileID} .topFace`).classed('susTileTop', true)
          d3.select(`${tileID} .sideProfile`).classed('susTileSide', true)
          d3.select(`${tileID} .topFace`).classed('infTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('infTileSide', false)
          d3.select(`${tileID} .topFace`).classed('recTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('recTileSide', false)
      } else if (status == "infected"){
          // console.log("Infected Tiles: ", tileID)
          // console.log(tileD3)
          d3.selectAll(`${tileID} > .letterS`).remove()
          d3.selectAll(`${tileID} > .letterR`).remove()
          d3.select(`${tileID}`).append("polyline").attr("points", sirI).attr('class','letterI')

          // update the tile colors
          d3.select(`${tileID} .topFace`).classed('infTileTop', true)
          d3.select(`${tileID} .sideProfile`).classed('infTileSide', true)
          d3.select(`${tileID} .topFace`).classed('susTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('susTileSide', false)
          d3.select(`${tileID} .topFace`).classed('recTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('recTileSide', false)

      } else if (status == "recovered"){
          // console.log("Recovered tiles: ", tileID)
          d3.selectAll(`${tileID} > .letterS`).remove()
          d3.selectAll(`${tileID} > .letterI`).remove()
          d3.select(`${tileID}`).append("path").attr("d", sirR).attr('class','letterR')

          // update the tile colors
          d3.select(`${tileID} .topFace`).classed('recTileTop', true)
          d3.select(`${tileID} .sideProfile`).classed('recTileSide', true)
          d3.select(`${tileID} .topFace`).classed('susTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('susTileSide', false)
          d3.select(`${tileID} .topFace`).classed('infTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('infTileSide', false)
      } else if (status = "") {
          // console.log("tiles are not S, I, or R")
          d3.selectAll(`${tileID} > .letterS`).remove()
          d3.selectAll(`${tileID} > .letterI`).remove()
          d3.selectAll(`${tileID} > .letterR`).remove()
         
          d3.select(`${tileID} .topFace`).classed('susTileTop', true)
          d3.select(`${tileID} .sideProfile`).classed('susTileSide', true)
          d3.select(`${tileID} .topFace`).classed('infTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('infTileSide', false)
          d3.select(`${tileID} .topFace`).classed('recTileTop', false)
          d3.select(`${tileID} .sideProfile`).classed('recTileSide', false)
      }

    }
    function resetTileColors(){
      // console.log("resetTileColors is called")
      let allTiles = d3.selectAll('.tile')
      let allTops = d3.selectAll('.topFace')
      let allSides = d3.selectAll('.sideProfile')
      allTops.classed('susTileTop', true)
      allSides.classed('susTileSide', true)
      allTops.classed('infTileTop', false)
      allSides.classed('infTileSide', false)
      allTops.classed('recTileTop', false)
      allSides.classed('recTileSide', false)

      allTiles.selectAll('.letterS, .letterI, .letterR').remove()
      allTiles.selectAll('polyline').remove()
    }
  }, []);

  // what is rendered:
  return (<>
  <div ref={ref}>
  <Header
          brand="COVID-19 Modules"
          color="dark"
          fixed          
          // routes={dashboardRoutes}
          rightLinks={<HeaderLinks />}
       />

<div className="mainContainer fixedParent">
    <h1 className = "sectionTitle">
      Module 1.2: SIR Model in Practice
    </h1>
    <div className="textContainer">
      <p>Now that we've defined S (Susceptible), I (Infectious), and R (Recovered), let's look at what the SIR model looks like in practice.</p>
    </div> {/* closes textContainer */}
    <div id = "moduleSvgDiv" className="scrollingContainer">
      <svg id="moduleSvg" width="50%" height="30%" viewBox="0 0 2000 1600">
        <g className="tilegroup">
        </g> 
        <g id="init_scene">
          <g className="full_person">
            <g id="person">
              <g id="legs">
                <g className="right_leg_group">
                  <line id="right_foot" className="st0" x1="32.4" y1="155.4" x2="32.4" y2="213.8"/>
                  <path id="right_foot" className="st1" d="M36.7,217.5l-3.6-2.1c-1-0.6-1.3-1.8-0.8-2.8l0.1-0.1c0.6-1,1.8-1.3,2.8-0.8l3.6,2.1
                    c1,0.6,1.3,1.8,0.8,2.8l-0.1,0.1C39,217.7,37.7,218,36.7,217.5z"/>
                </g>
                <g className="left_leg_group">
                  <line id="left_leg" className="st0" x1="71.9" y1="156.7" x2="71.9" y2="215.2"/>
                  <path id="left_foot" className="st1" d="M75.9,217.1l-4.4-2.5c-1-0.6-1.3-1.8-0.8-2.8l0.1-0.1c0.6-1,1.8-1.3,2.8-0.8l4.4,2.5
                    c1,0.6,1.3,1.8,0.8,2.8l-0.1,0.1C78.2,217.4,76.9,217.7,75.9,217.1z"/>
                </g>
              </g>
              <g id="infected">
                <path id="infLArmUpper" className="leftarm st2" d="M92.4,118.9c-1.3,0-2.6-0.7-3.4-1.8l-17.9-28c-1.2-1.9-0.6-4.3,1.2-5.5
                  c1.9-1.2,4.3-0.6,5.5,1.2l17.9,28c1.2,1.9,0.6,4.3-1.2,5.5C93.9,118.7,93.1,118.9,92.4,118.9z"/>
                <path id="infBody" className="st3" d="M97.4,79c1.9,12.1-12.7,15.5-16.1,33.1c-3.7,19.2,7.9,26.8,2.3,40.1c-5.2,12-21.7,15.6-36.4,12.7
                  c-18.5-3.6-32.5-18.7-34.1-40.5c-1.3-7.5-2.9-24,5.5-41.2c3.2-6.6,8.5-17.2,20.8-23.4c14.8-7.4,29.4-2.9,33.1-1.7
                  C75.5,59.2,95.1,65.7,97.4,79z"/>
                <path id="infLArmLower" className="leftarm st2" d="M72.4,126.5c-1.6,0-3-0.9-3.7-2.4c-0.9-2,0.1-4.4,2.1-5.2l19.9-8.4c2-0.9,4.4,0.1,5.2,2.1
                  c0.9,2-0.1,4.4-2.1,5.2L74,126.2C73.4,126.4,72.9,126.5,72.4,126.5z"/>
                <path id="infRArmLower" className="rightarm st2" d="M59.6,131.2c-0.3,0-0.6,0-0.9-0.1L29,123.9c-2.1-0.5-3.5-2.7-2.9-4.8
                    c0.5-2.1,2.7-3.5,4.8-2.9l29.6,7.2c2.1,0.5,3.5,2.7,2.9,4.8C63,130,61.4,131.2,59.6,131.2z"/>
                  <path id="infRArmUpper" className="rightarm st2" d="M30,124c-1.6,0-3.1-1-3.7-2.6l-9.2-24.3c-0.8-2.1,0.3-4.4,2.3-5.2
                    c2.1-0.8,4.4,0.3,5.2,2.3l9.2,24.3c0.8,2.1-0.3,4.4-2.3,5.2C30.9,124,30.4,124,30,124z"/>
                <g id="infHead">
                  <path id="infFace" className="st5" d="M95.5,28.9c-2.5-0.5-3.2,2.1-7.8,2.8c-5.2,0.9-9.7-1.3-11.4-2.2c-5-2.5-5-4.9-7.6-4.9
                    c-5.5,0-8.6,10.4-11.4,9.7c-2.2-0.5-1.8-7.8-3.3-7.9c-0.7,0-1.2,2.1-3,5.6c-1.7,3.3-4.2,7.2-4.9,6.9c-1.1-0.5,2.6-10.5,1.1-11.2
                    c-1.4-0.7-6.4,7.7-7.6,7.1c-0.1,0-0.1-0.1-0.1-0.1l-1.3,5c-1.8,7.9,0.3,16.2,6,22c4,4.6,10,8.4,16.8,10.3c0.5,0.3,1,0.3,1.6,0.5
                    c6.1,1.5,12.5,1.6,18.6,0.2c9.8-2.2,16.6-8.6,19.1-17.8l3-12.1C101.8,42.2,100.7,30,95.5,28.9z M70.6,59.6c2-4.9,7-7.6,11.6-6.8
                    c3.8,0.7,6.9,3.5,8,7.2L70.6,59.6z"/>
                  <path id="infHair" className="st6" d="M104.1,32.8c-1.8-10-10.5-19.1-21.4-23.8c-15.3-6.3-29.6,0-36.9,9.4c-1.7,2.2-3,4.6-3.9,7.1
                    c0,0.1-0.1,0.2-0.1,0.3c-1.4,3.6-2.9,8-2.3,8.9c0,0.1,0.1,0.1,0.1,0.1c1.2,0.6,6.2-7.8,7.6-7.1c1.5,0.7-2.2,10.7-1.1,11.2
                    c0.7,0.3,3.2-3.6,4.9-6.9c1.8-3.5,2.3-5.6,3-5.6c1.5,0.1,1.1,7.4,3.3,7.9c2.8,0.7,5.9-9.7,11.4-9.7c2.6,0,2.6,2.4,7.6,4.9
                    c1.7,0.9,6.2,3.1,11.4,2.2c4.6-0.7,5.3-3.3,7.8-2.8c5.2,1.1,6.3,13.3,7.8,13.9c0,0,0.1,0,0.1,0C104.2,42.8,105.1,37.9,104.1,32.8z
                    "/>
                  <path id="infMouth" className="st7" d="M82.2,52.8c-4.6-0.8-9.6,1.9-11.6,6.8L90.2,60C89.1,56.3,86,53.5,82.2,52.8z"/>
                </g>
              </g>
              <g id="recovered">
                <path id="recLArmUpper" className="leftarm st8" d="M106.6,71.5c-0.2,0-0.4,0-0.7-0.1c-2.2-0.4-3.7-2.4-3.3-4.6l5-30
                  c0.4-2.2,2.4-3.7,4.6-3.3c2.2,0.4,3.7,2.4,3.3,4.6l-5,30C110.3,70.1,108.6,71.5,106.6,71.5z"/>
                <path id="recLArmLower" className="leftarm st8" d="M78.1,86.5c-1.4,0-2.8-0.8-3.6-2.2c-1-2-0.2-4.4,1.7-5.4l27-14l5-28.9c0.4-2.2,2.4-3.6,4.6-3.3
                  c2.2,0.4,3.6,2.4,3.3,4.6l-5.6,32.9L79.9,86.1C79.3,86.4,78.7,86.5,78.1,86.5z"/>
                <path id="recBody" className="st9" d="M64.3,55c31.4,22.7,49.3,86.1,11.6,111.7c-31.4,22.6-76.8-1.2-76.3-43.1C0,97.2,15.4,65.4,33.7,54.3
                  C41.8,48.4,55.8,48.5,64.3,55"/>
                <path id="recRArmLower" className="rightarm st8" d="M15.2,95.9c-1,0-2-0.4-2.8-1.2L-8.1,74.3c-1.6-1.6-1.6-4.1,0-5.7
                  c1.6-1.6,4.1-1.6,5.7,0L18,89.1c1.6,1.6,1.6,4.1,0,5.7C17.3,95.5,16.2,95.9,15.2,95.9z"/>
                <path id="recRArmUpper" className="rightarm st8" d="M-5.3,75.5c-1.7,0-3.3-1.1-3.8-2.8L-17,46.9c-0.7-2.1,0.5-4.4,2.6-5
                  c2.1-0.7,4.4,0.5,5,2.6l7.9,25.7c0.7,2.1-0.5,4.4-2.6,5C-4.5,75.4-4.9,75.5-5.3,75.5z"/>
                <g id="recHead">
                  <path id="recFace" className="st8" d="M67.2,15.7c-2.6,0.1-2.7,2.8-7,4.7c-4.8,2.1-9.8,1-11.7,0.6c-5.6-1.2-6.3-3.5-8.8-2.9
                    c-5.3,1.3-5.8,12.4-8.8,12.3c-2.5,0-3.8-7.3-5.3-7c-0.8,0.1-0.7,2.3-1.6,6.2c-0.8,3.5-2.3,8-3.1,7.9c-1.2-0.1-0.1-10.9-1.7-11.2
                    c-1.6-0.3-4.5,9.1-5.8,8.8v5.1c0.1,8.2,4.3,15.9,11.3,20.3c5.6,3.8,12.3,5.8,19.1,6c0.5,0,1.1,0,1.7,0c6.4,0,12.7-1.4,18.4-4.3
                    C73,57.5,78.2,49.6,78.3,40V27.4C77,27.9,72.8,15.5,67.2,15.7z M59.2,54.9c-5.1-0.4-9.6-3.6-11.7-8.3l26-2.4
                    C71.5,50.9,65.5,55.3,59.2,54.9z"/>
                  <path id="recHair" className="st10" d="M76.7,17.3C72.5,8,61.5,1,49.7-0.8C29.2-3.9,14.8,11.6,13.3,25.4c-0.4,4.2-1,9.5,0,9.7
                    c1.3,0.3,4.2-9.1,5.8-8.8c1.6,0.3,0.5,11.1,1.7,11.2c0.8,0.1,2.3-4.4,3.1-7.9c0.9-3.9,0.8-6.1,1.6-6.2c1.5-0.3,2.8,7,5.3,7
                    c3,0.1,3.5-11,8.8-12.3c2.5-0.6,3.2,1.7,8.8,2.9c1.9,0.4,6.9,1.5,11.7-0.6c4.3-1.9,4.4-4.6,7-4.7c5.6-0.2,9.8,12.2,11.2,11.7
                    C79.2,27.2,78.8,22.1,76.7,17.3z"/>
                  <path id="recMouth" className="st11" d="M59.2,54.9c6.3,0.4,12.4-4,14.3-10.7l-26,2.4C49.5,51.3,54,54.5,59.2,54.9z"/>
                </g>
              </g>
              <g id="susceptible">
                <path id="susLArmUpper" className="leftarm st8" d="M92.2,110.7c-1.4,0-2.7-0.7-3.4-1.9l-16.2-27c-1.1-1.9-0.5-4.4,1.4-5.5
                    c1.9-1.1,4.4-0.5,5.5,1.4l16.2,27c1.1,1.9,0.5,4.4-1.4,5.5C93.6,110.5,92.9,110.7,92.2,110.7z"/>
                <path id="susBody" className="st9" d="M64.8,54.9c31.4,22.7,49.3,86.1,11.5,111.7C45,189.2-0.5,165.4,0,123.5
                  c0.4-26.4,15.7-58.2,34.1-69.3C42.3,48.3,56.3,48.4,64.8,54.9"/>
                <path id="susLArmLower" className="leftarm st8" d="M107.8,136.6c-1.4,0-2.7-0.7-3.4-1.9l-15.6-25.9c-1.1-1.9-0.5-4.4,1.4-5.5
                  c1.9-1.1,4.3-0.5,5.5,1.4l15.6,26c1.1,1.9,0.5,4.4-1.4,5.5C109.2,136.4,108.5,136.6,107.8,136.6z"/>
                <path id="susRArmUpper" className="rightarm st8" d="M30.2,121.9c-1.6,0-3-0.9-3.7-2.4l-9.8-22.9c-0.9-2,0.1-4.4,2.1-5.2
                  c2-0.9,4.4,0.1,5.2,2.1l9.8,22.9c0.9,2-0.1,4.4-2.1,5.2C31.3,121.8,30.7,121.9,30.2,121.9z"/>
                <path id="susRArmLower" className="rightarm st8" d="M54,138.4c-0.8,0-1.6-0.2-2.3-0.7l-23.8-16.5c-1.8-1.3-2.3-3.7-1-5.6
                  c1.3-1.8,3.7-2.3,5.6-1l23.8,16.5c1.8,1.3,2.3,3.7,1,5.6C56.6,137.8,55.3,138.4,54,138.4z"/>
                <g id="susHead">
                  <path id="susFace" className="st8" d="M67.5,15.6c-2.6,0.1-2.6,2.8-7,4.7c-4.8,2.1-9.8,1-11.7,0.6c-5.6-1.2-6.3-3.5-8.8-2.9
                    c-5.3,1.3-5.8,12.4-8.8,12.3c-2.5,0-3.8-7.3-5.3-7c-0.8,0.1-0.7,2.3-1.6,6.2c-0.8,3.5-2.3,8-3.1,7.9c-1.1-0.1,0-10.9-1.6-11.2
                    c-1.6-0.3-4.5,9.1-5.8,8.8v5.1c0.1,8.2,4.3,15.9,11.3,20.3c5.7,3.8,12.3,5.8,19.2,6c0.5,0,1.1,0,1.7,0c6.4,0,12.7-1.4,18.4-4.3
                    c9.1-4.7,14.2-12.6,14.4-22.2V27.3c0,0-0.1,0-0.1,0.1C77.3,27.8,73.1,15.4,67.5,15.6z"/>
                  <path id="susHair" className="st10" d="M77.1,17.2C72.9,7.9,62,1,50.1-0.9C29.6-4,15.2,11.5,13.8,25.3c-0.4,4.2-1,9.5,0,9.7
                    c1.3,0.3,4.2-9.1,5.8-8.8c1.6,0.3,0.5,11.1,1.6,11.2c0.8,0.1,2.3-4.4,3.1-7.9c0.9-3.9,0.8-6.1,1.6-6.2c1.5-0.3,2.8,7,5.3,7
                    c3,0.1,3.5-11,8.8-12.3c2.5-0.6,3.2,1.7,8.8,2.9c1.9,0.4,6.9,1.5,11.7-0.6c4.4-1.9,4.4-4.6,7-4.7c5.6-0.2,9.8,12.2,11.2,11.7
                    c0,0,0.1,0,0.1-0.1C79.7,26.8,79.2,21.9,77.1,17.2z"/>
                  <path id="susMouth" className="st7" d="M51.2,52.7c-6.4,0-9.8-3.4-9.9-3.4l-1.4,1.4c0.2,0.2,4,4,11.3,4c8.2,0,11.2-3.9,11.4-4.1
                    L61,49.4C60.9,49.5,58.4,52.7,51.2,52.7z"/>
                </g>
              </g>
              <g id="base">
                <path id="baseLArmLower" className="leftarm st8" d="M107.8,136.6c-1.4,0-2.7-0.7-3.4-1.9l-15.6-25.9c-1.1-1.9-0.5-4.4,1.4-5.5
                  c1.9-1.1,4.3-0.5,5.5,1.4l15.6,26c1.1,1.9,0.5,4.4-1.4,5.5C109.2,136.4,108.5,136.6,107.8,136.6z"/>
                <path id="baseLArmUpper" className="leftarm st8" d="M92.2,110.7c-1.4,0-2.7-0.7-3.4-1.9l-16.2-27c-1.1-1.9-0.5-4.4,1.4-5.5
                  c1.9-1.1,4.4-0.5,5.5,1.4l16.2,27c1.1,1.9,0.5,4.4-1.4,5.5C93.6,110.5,92.9,110.7,92.2,110.7z"/>
                <path id="baseBody" className="st9" d="M64.8,54.9c31.4,22.7,49.3,86.1,11.5,111.7C45,189.2-0.5,165.4,0,123.5
                  c0.4-26.4,15.7-58.2,34.1-69.3C42.3,48.3,56.3,48.4,64.8,54.9"/>
                <path id="baseRArmUpper" className="rightarm st8" d="M30.2,121.9c-1.6,0-3-0.9-3.7-2.4l-9.8-22.9c-0.9-2,0.1-4.4,2.1-5.2
                  c2-0.9,4.4,0.1,5.2,2.1l9.8,22.9c0.9,2-0.1,4.4-2.1,5.2C31.3,121.8,30.7,121.9,30.2,121.9z"/>
                <path id="baseRArmLower" className="rightarm st8" d="M54,138.4c-0.8,0-1.6-0.2-2.3-0.7l-23.8-16.5c-1.8-1.3-2.3-3.7-1-5.6
                  c1.3-1.8,3.7-2.3,5.6-1l23.8,16.5c1.8,1.3,2.3,3.7,1,5.6C56.6,137.8,55.3,138.4,54,138.4z"/>
                <g id="baseHead">
                  <path id="baseFace" className="st8" d="M67.5,15.6c-2.6,0.1-2.6,2.8-7,4.7c-4.8,2.1-9.8,1-11.7,0.6c-5.6-1.2-6.3-3.5-8.8-2.9
                    c-5.3,1.3-5.8,12.4-8.8,12.3c-2.5,0-3.8-7.3-5.3-7c-0.8,0.1-0.7,2.3-1.6,6.2c-0.8,3.5-2.3,8-3.1,7.9c-1.1-0.1,0-10.9-1.6-11.2
                    c-1.6-0.3-4.5,9.1-5.8,8.8v5.1c0.1,8.2,4.3,15.9,11.3,20.3c5.7,3.8,12.3,5.8,19.2,6c0.5,0,1.1,0,1.7,0c6.4,0,12.7-1.4,18.4-4.3
                    c9.1-4.7,14.2-12.6,14.4-22.2V27.3c0,0-0.1,0-0.1,0.1C77.3,27.8,73.1,15.4,67.5,15.6z"/>
                  <path id="baseHair" className="st10" d="M77.1,17.2C72.9,7.9,62,1,50.1-0.9C29.6-4,15.2,11.5,13.8,25.3c-0.4,4.2-1,9.5,0,9.7
                    c1.3,0.3,4.2-9.1,5.8-8.8c1.6,0.3,0.5,11.1,1.6,11.2c0.8,0.1,2.3-4.4,3.1-7.9c0.9-3.9,0.8-6.1,1.6-6.2c1.5-0.3,2.8,7,5.3,7
                    c3,0.1,3.5-11,8.8-12.3c2.5-0.6,3.2,1.7,8.8,2.9c1.9,0.4,6.9,1.5,11.7-0.6c4.4-1.9,4.4-4.6,7-4.7c5.6-0.2,9.8,12.2,11.2,11.7
                    c0,0,0.1,0,0.1-0.1C79.7,26.8,79.2,21.9,77.1,17.2z"/>
                  <path id="baseMouth" className="st7" d="M51.2,52.7c-6.4,0-9.8-3.4-9.9-3.4l-1.4,1.4c0.2,0.2,4,4,11.3,4c8.2,0,11.2-3.9,11.4-4.1
                    L61,49.4C60.9,49.5,58.4,52.7,51.2,52.7z"/>                 
                </g>
              </g>
            </g>
            <g id="lightnings">
              <polygon id="lightening_4" className="lightning st4" points="125.5,98.6 121.9,95.7 132.3,92.1 129.2,87 114,94.5 116.6,96.9 108.8,102.2 	"/>
              <polygon id="lightening_3" className="lightning st4" points="-7.6,77.6 -9.3,82.3 -16.6,73 -20.7,77.9 -7.9,90.8 -6.3,87.3 1.8,93.5 	"/>
              <polygon id="lightening_2" className="lightning st4" points="111.6,143 112,138.5 120.8,144.9 123.1,139.5 108.5,131.2 107.9,134.7 99.2,131.2 	
                "/>
              <polygon id="lightening_1" className="lightening st4" points="-4,144.2 -0.5,147.2 -10.9,150.5 -7.9,155.7 7.5,148.7 4.8,146.1 12.9,141.1 	"/>
            </g> {/* closes person group */}
            <g id="spotlight">
            <linearGradient id="lightbeam_1_" gradientUnits="userSpaceOnUse" x1="108.5714" y1="388.7064" x2="108.5714" y2="12.6929">
                <stop  offset="0" id="lightstop1" />
                <stop  offset="1" id="lightstop2" />
              </linearGradient>
              <path id="lightbeam" className="lightbeam_st" d="M163.9,402.5H53.3C5,402.5-12.7,310.4,9.4,235L78,0h61.2l68.6,235
                C229.8,310.4,212.2,402.5,163.9,402.5z"/>
              {/* <defs>
                <linearGradient id="a" x1="106.0809" x2="106.0809" y2="353.0612" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#fff"/>
                  <stop offset="0.1244" stopColor="#fff" stopOpacity="0.8137"/>
                  <stop offset="0.3042" stopColor="#fff" stopOpacity="0.5696"/><stop offset="0.4768" stopColor="#fff" stopOpacity="0.3661"/>
                  <stop offset="0.6372" stopColor="#fff" stopOpacity="0.2075"/>
                  <stop offset="0.7827" stopColor="#fff" stopOpacity="0.0937"/>
                  <stop offset="0.9084" stopColor="#fff" stopOpacity="0.0245"/>
                  <stop offset="1" stopColor="#fff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path id="spotlightpath" d="M106.0809,0,6.0487,243.3674C-15.45,295.6717,23.0093,353.0612,79.56,353.0612h53.0427c56.55,0,95.01-57.3895,73.5108-109.6938Z"/> */}
            </g> {/* closes spotlight group */}
          </g>  {/* closes full_person group */}
          <g className = "perpendicularPerson">
            <g id="wg_leg_group">
              <g id="wg_left_leg_group">
                <path id="wg_left_leg_1_" className="wgst0" d="M36.7,219c2.1,0,3.9-2.9,3.9-6.4v-48.1c0-3.5-1.7-6.4-3.9-6.4s-3.9,2.9-3.9,6.4v48.1
                  C32.8,216.2,34.6,219,36.7,219z"/>
                <path id="wg_left_foot_1_" className="wgst1" d="M31.3,226.8c0.9,0,1.8-0.2,2.6-0.8l6-3.9c2.5-1.6,3.3-5.1,1.9-7.9
                  c-1.4-2.8-4.6-3.7-7-2.1l-6,3.9c-2.5,1.6-3.3,5.1-1.9,7.9C27.8,225.7,29.5,226.8,31.3,226.8z"/>
              </g>
              <g id="wg_right_leg_group">
                <path id="wg_right_leg" className="wgst0" d="M76.4,219c2.1,0,3.9-2.9,3.9-6.4v-48.1c0-3.5-1.7-6.4-3.9-6.4s-3.9,2.9-3.9,6.4v48.1
                  C72.5,216.1,74.3,219,76.4,219z"/>
                <path id="wg_right_foot" className="wgst1" d="M71,226.7c0.9,0,1.8-0.2,2.6-0.8l6-3.9c2.5-1.6,3.3-5.1,1.9-7.9c-1.4-2.8-4.6-3.7-7-2.1
                  l-6,3.9c-2.5,1.6-3.3,5.1-1.9,7.9C67.5,225.7,69.2,226.7,71,226.7z"/>
              </g>
            </g>  {/* close leg group for wg */}
            <g id="wg_susceptible">
              <path id="wgSusLArmLower" className="wgst0" d="M5.7,126.5c0.8-0.2,1.6-0.7,2.2-1.4l21.8-25.2c1.6-1.9,1.4-4.7-0.5-6.4
                c-1.9-1.6-4.7-1.4-6.4,0.5L1.1,119.2c-1.6,1.9-1.4,4.7,0.5,6.4C2.7,126.6,4.3,126.9,5.7,126.5z"/>
              <path id="wgSusLArmUpper" className="wgst0" d="M17,113.6c0.8-0.2,1.6-0.7,2.2-1.4L41,87c1.6-1.9,1.4-4.7-0.5-6.4
                c-1.9-1.6-4.7-1.4-6.4,0.5l-21.8,25.2c-1.6,1.9-1.4,4.7,0.5,6.4C14,113.7,15.6,114,17,113.6z"/>
              <path id="wgSusBody" className="wgst2" d="M82.9,171.7c-6.2,5.3-48.6,7.6-54-2.3c-6.5-11.9-1.3-66.7-1.2-95.3c0-10.6,14.9-18.7,28.4-18.9
                c8.4-0.1,17,3.4,23.1,8.7c4.9,4.3,7.6,11.1,7.6,18.2c0,8.9-1.4,16.9-1.5,38.5C85.2,147,86.8,168.4,82.9,171.7z"/>
              <path id="wgSusRArmUpper" className="wgst0" d="M68,120.8c2.6,0,4.8-2.1,4.8-4.8V80.4c0-2.6-2.1-4.8-4.8-4.8s-4.8,2.1-4.8,4.8V116
                C63.2,118.7,65.4,120.8,68,120.8z"/>
              <path id="wgSusRArmLower" className="wgst0" d="M49,146.3c2.2,1.4,5,1,6.2-0.9l16.9-26.2c1.2-1.9,0.5-4.6-1.7-6.1
                c-2.2-1.4-5-1-6.2,0.9l-16.9,26.2C46,142.1,46.8,144.8,49,146.3z"/>
              <g id="wgSusHead">
                <path id="wgSusFace" className="wgst0" d="M28.1,28.3c0.4,0.8,2.8-10.4,2.8-10.4c-0.4-2.9,12-1.8,16.4-1.5c3.6,0.3,19.4-1.1,19.4,3.6
                  l3.8,15.8c2.2,0.6,2.2-7.9,4.5-9.9c1.9-1.8,4.4,4.9,4.9,4.6L80,43.9c-2.7,24.9-49.8,23.2-52.5-1.8V27.2v-1
                  C27.6,26.9,27.8,27.6,28.1,28.3z"/>
                <path id="wgSusHair" className="wgst3" d="M75,25.8c-2.3,2.1-2.3,10.5-4.5,9.9L66.8,20c0-4.7-15.8-3.3-19.4-3.6C42.9,16,30.6,14.9,31,17.9
                  c0,0-2.5,11.2-2.8,10.4c-0.3-0.7-0.5-1.4-0.7-2.1C26,19.7,29,10.9,30.8,9.4c2.5-2,5.5-5,10.2-7.2c2.4-1.1,6.5-1.9,11-2.2
                  c9.8-0.6,18,4.9,19.9,5.9c5.6,2.9,9.4,12.7,8.1,24.4c0,0.1,0,0.2-0.1,0.2C79.4,30.8,76.9,24.1,75,25.8z"/>
                 <path id="wgSusMouth" className="wgst8" d="M51.2,52.7c-6.4,0-9.8-3.4-9.9-3.4l-1.4,1.4c0.2,0.2,4,4,11.3,4c8.2,0,11.2-3.9,11.4-4.1
                    L61,49.4C60.9,49.5,58.4,52.7,51.2,52.7z"/>    
              </g>{/*close wgsushead */}
            </g> {/* closes wg sus */}
            <g id="wg_infected">
              <path id="wgInfLArmUpper" className="wgst4" d="M16,115.3c0.8-0.2,1.6-0.7,2.2-1.4L40,88.7c1.6-1.9,1.4-4.7-0.5-6.4
                c-1.9-1.6-4.7-1.4-6.4,0.5L11.4,108c-1.6,1.9-1.4,4.7,0.5,6.4C13,115.4,14.6,115.7,16,115.3z"/>
              <path id="wgInfBody" className="wgst5" d="M79.9,169.8c-8.9,6.6-20.8,6.6-28.2,6.7c-10.6,0-18.4,0.1-22.9-4.9c-8.7-9.7,8.2-24.6,5.6-53.6
                c-1.7-18.8-9.9-25.3-4.8-38.6c0.8-2,5.1-13.3,16.2-17.4c2.3-0.9,7-2.1,12.6-1.1c2.3,0.4,9.1,2.1,17.2,11.8c8.2,9.9,12.5,22,14.6,36
                C92.9,126,97.5,156.8,79.9,169.8z"/>
              <path id="wgInfLArmLower" className="wgst4" d="M38.1,126.9c1.5-2.2,1.5-4.7,0.1-5.7l-19.6-13.3c-1.4-1-3.8,0-5.3,2.2
                s-1.5,4.7-0.1,5.7L32.8,129C34.3,130,36.6,129,38.1,126.9z"/>
              <path id="wgInfRArmUpper" className="wgst4" d="M75.1,120.8c2.6,0,4.8-1.9,4.8-4.2V85.2c0-2.3-2.1-4.2-4.8-4.2
                c-2.6,0-4.8,1.9-4.8,4.2v31.4C70.4,118.9,72.5,120.8,75.1,120.8z"/>
              <path id="wgInfRArmLower" className="wgst4" d="M51.2,131.6c1.3,2.3,3.7,3.3,5.4,2.3l22-13.1c1.6-1,1.8-3.6,0.5-5.8
                c-1.3-2.3-3.7-3.3-5.4-2.3l-22,13.1C50.1,126.8,49.9,129.4,51.2,131.6z"/>
              <g id="wgInfHead">
                <path id="wgInfFace" className="wgst6" d="M53.1,37.1C39.2,17.6,2,36.4,10.1,59.9l3.8,6.3l7.2,11.9c14.2,18.6,52.3-2.7,42.5-23.9
                L53.1,37.1z"/>
                <path id="wgInfHair" className="wgst7" d="M57.1,43.5C52.4,33.6,44.7,27.6,38.9,28c-2,0.1-11.1-0.3-18.6,5c-3.4,2.4-6.3,5-7.6,7
                  C9.9,43.9,9,47.8,8,50.6C7.2,52.8,9.6,63,14.9,66.8c0.7,0.5-2.8-9.6-2.8-9.6c-1.7-2.2,8.6-7.2,12.3-9.1c3-1.5,14.9-10.2,17.1-6.5
                  l10.6,10.7c2-0.6-2-7.3-1.2-10.1C51.7,39.8,57.7,44.8,57.1,43.5z"/>
                <path id="wgInfMouth" className="wgst8" d="M48.6,70.7c-3.7-3.9-9.3-4.7-13.5-2.2c-3.3,2.1-5.2,5.8-5,9.7"/>
              </g>{/*close wginfhead */}
            </g> {/**close wg inf */}

            <g id="wg_base">
              <path id="wgBaseLArmLower" className="wgst0" d="M5.7,126.5c0.8-0.2,1.6-0.7,2.2-1.4l21.8-25.2c1.6-1.9,1.4-4.7-0.5-6.4
                c-1.9-1.6-4.7-1.4-6.4,0.5L1.1,119.2c-1.6,1.9-1.4,4.7,0.5,6.4C2.7,126.6,4.3,126.9,5.7,126.5z"/>
              <path id="wgBaseLArmUpper" className="wgst0" d="M17,113.6c0.8-0.2,1.6-0.7,2.2-1.4L41,87c1.6-1.9,1.4-4.7-0.5-6.4
                c-1.9-1.6-4.7-1.4-6.4,0.5l-21.8,25.2c-1.6,1.9-1.4,4.7,0.5,6.4C14,113.7,15.6,114,17,113.6z"/>
              <path id="wgBaseBody" className="wgst2" d="M82.9,171.7c-6.2,5.3-48.6,7.6-54-2.3c-6.5-11.9-1.3-66.7-1.2-95.3c0-10.6,14.9-18.7,28.4-18.9
                c8.4-0.1,17,3.4,23.1,8.7c4.9,4.3,7.6,11.1,7.6,18.2c0,8.9-1.4,16.9-1.5,38.5C85.2,147,86.8,168.4,82.9,171.7z"/>
              <path id="wgBaseRArmUpper" className="wgst0" d="M68,120.8c2.6,0,4.8-2.1,4.8-4.8V80.4c0-2.6-2.1-4.8-4.8-4.8s-4.8,2.1-4.8,4.8V116
                C63.2,118.7,65.4,120.8,68,120.8z"/>
              <path id="wgBaseRArmLower" className="wgst0" d="M49,146.3c2.2,1.4,5,1,6.2-0.9l16.9-26.2c1.2-1.9,0.5-4.6-1.7-6.1
                c-2.2-1.4-5-1-6.2,0.9l-16.9,26.2C46,142.1,46.8,144.8,49,146.3z"/>
              <g id="wgBaseHead">
                <path id="wgBaseFace" className="wgst0" d="M28.1,28.3c0.4,0.8,2.8-10.4,2.8-10.4c-0.4-2.9,12-1.8,16.4-1.5c3.6,0.3,19.4-1.1,19.4,3.6
                  l3.8,15.8c2.2,0.6,2.2-7.9,4.5-9.9c1.9-1.8,4.4,4.9,4.9,4.6L80,43.9c-2.7,24.9-49.8,23.2-52.5-1.8V27.2v-1
                  C27.6,26.9,27.8,27.6,28.1,28.3z"/>
                <path id="wgBaseHair" className="wgst3" d="M75,25.8c-2.3,2.1-2.3,10.5-4.5,9.9L66.8,20c0-4.7-15.8-3.3-19.4-3.6C42.9,16,30.6,14.9,31,17.9
                  c0,0-2.5,11.2-2.8,10.4c-0.3-0.7-0.5-1.4-0.7-2.1C26,19.7,29,10.9,30.8,9.4c2.5-2,5.5-5,10.2-7.2c2.4-1.1,6.5-1.9,11-2.2
                  c9.8-0.6,18,4.9,19.9,5.9c5.6,2.9,9.4,12.7,8.1,24.4c0,0.1,0,0.2-0.1,0.2C79.4,30.8,76.9,24.1,75,25.8z"/>
                <path id="wgBaseMouth" className="wgst8" d="M51.2,52.7c-6.4,0-9.8-3.4-9.9-3.4l-1.4,1.4c0.2,0.2,4,4,11.3,4c8.2,0,11.2-3.9,11.4-4.1
                    L61,49.4C60.9,49.5,58.4,52.7,51.2,52.7z"/>                      
              </g> {/*close wgbasehead */}
            </g> {/* closes wg base */}
            <g id="wglightning">
              <polygon className="wgst9" points="-20.8,103.9 -16.4,100.3 -29.2,95.8 -25.4,89.5 -6.5,98.7 -9.8,101.8 0,108.3 	"/>
              <polygon className="wgst9" points="118.3,77.8 120.5,83.6 129.5,72.1 134.5,78.1 118.7,94.2 116.7,89.8 106.7,97.5 	"/>
              <polygon className="wgst9" points="-3.5,159 -4,153.3 -15,161.3 -17.9,154.7 0.3,144.3 1,148.7 11.9,144.4 	"/>
              <polygon className="wgst9" points="113.8,160.5 109.5,164.2 122.4,168.4 118.7,174.7 99.6,166 102.8,162.9 92.9,156.6 	"/>
              <polygon className="wgst9" points="-20.8,103.9 -16.4,100.3 -29.2,95.8 -25.4,89.5 -6.5,98.7 -9.8,101.8 0,108.3 	"/>
              <polygon className="wgst9" points="118.3,77.8 120.5,83.6 129.5,72.1 134.5,78.1 118.7,94.2 116.7,89.8 106.7,97.5 	"/>
              <polygon className="wgst9" points="-3.5,159 -4,153.3 -15,161.3 -17.9,154.7 0.3,144.3 1,148.7 11.9,144.4 	"/>
              <polygon className="wgst9" points="113.8,160.5 109.5,164.2 122.4,168.4 118.7,174.7 99.6,166 102.8,162.9 92.9,156.6 	"/>
            </g>
          </g> {/* closes perpendicularPerson */}
        </g>  {/* closes init_scene group */}
      </svg>
      <div className="scrollTextContainer">
        <h2 id="scrollHeader">{headerStartSus}</h2>
        <p id="scrollText">{startSus}</p>
      </div> {/* closes scrollingTextContainer */}
      <div className="markers" id="module2markers" >
          <div className="marker" id="step_5" style={{height: "75vh"}}></div>
          <div className="marker" id="step_6" style={{height: "20vh"}}></div>
          <div className="marker" id="step_7" style={{height: "20vh"}}></div>
          <div className="marker" id="step_8" style={{height: "50vh"}}></div>
          <div className="marker" id="step_9" style={{height: "80vh"}}></div>    
          <div className="marker" id="step_buffer" style={{height: "75vh"}}></div>          

      </div> {/* closes marker */}
    </div> {/* closes scrollingContainer */}
    <p className = "moduleText">This type of categorization is the foundation of a group of models often used to study diseases called <b>compartmental models</b>.</p>
    <p className = "moduleText">These models are handy because they are easily adapted to model different transmission scenarios.</p>
    <p className = "moduleText">The model type most often used is a <b>Susceptible, Infected, Recovered Model</b> or an <b>SIR Model</b>.</p>
  <Button component={Link} to ="/Module1" size="lg" round>
  &#8592; Go back to Module 1
  </Button>
  <Button component={Link} to ="/Module3" size="lg" round>
    Go to Module 3 &#8594;
  </Button>

  </div> {/* closes mainContainer */}
  </div>
  </>);
}