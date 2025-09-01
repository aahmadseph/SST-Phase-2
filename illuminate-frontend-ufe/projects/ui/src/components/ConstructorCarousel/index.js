import ConstructorCarousel from 'components/ConstructorCarousel/ConstructorCarousel';
import { withConstructorCarouselProps } from 'viewModel/constructorCarousel/withConstructorCarouselProps';

const ConnectedConstructorCarousel = withConstructorCarouselProps(ConstructorCarousel);

export default ConnectedConstructorCarousel;
