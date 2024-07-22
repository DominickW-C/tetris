DONE:

    - html elements to create site

    - make square class
        - make shape class which inherits from square
    
    - make movement 
        - moving side to side
        - falling 

    - funcation that updates the screen

    - reset the piece once it hits bottom 

    - make piece rotations

    - make collision dectection
        - add collision to the bottom

    -making line clearing
        -make pieces fall after clear

    - add quick drop

    - make down arrow drop faster

    - game over screen

    - hold pieces 
    
    - show the next few pieces

TODO:

    - make score and levels work
    - add a ghost piece at the bottom
    - make an about me screen

CURRENT BUGS:

    - tspins messes things up and will clip through blocks
    - can rotate pieces through other pieces

save the rotated cords, comapare and if there are overlapping cords then dont rotate
might cause an issue  since whe you draw a block there are overlapping cords

change quick drop into the shadow piece where it is always drawing it but never adding any of the collision
it will also avoid resetting it. if you do try to go for a quick drop the shadow pieces alph channel will change
and collision will be added, along with a reset

figure out how to reset the shadow

trying to do something where you shimmy the piece at the top in order to draw a shadow but it thinks that it is touching a piece when you do that
