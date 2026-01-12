<script>
    //2D3D4D
    import currentVNGame from '@C/games/components/VN/currentVNGame'
    import Old from './Old'
    import Balls from './Balls'
    import Input from './Input'
    import Quick from './Quick'
    export default {
        name: 'VN_PL2_PL3',
        extends: currentVNGame,
        components: {
            Old,
            Input,
            Balls,
            Quick
        }
    }
</script>
