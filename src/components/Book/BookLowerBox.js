import {
  VStack,
  Box,
  Text,
  HStack,
  Icon,
  useColorModeValue,
  ButtonGroup,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { BsBookmarkFill } from 'react-icons/bs'
import { ADD_BOOK } from '../../graphql/mutations'
import { ALL_BOOKS } from '../../graphql/queries'

const BookLowerBox = ({ lowerBoxBackground, book }) => {
  const toast = useToast()

  const [addBook] = useMutation(ADD_BOOK, {
    onError: error => {
      console.log(error)
      toast({
        title: 'Error',
        description: error.graphQLErrors[0].message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    },
    update(cache, { data: { addBook } }) {
      cache.modify({
        fields: {
          allBooks(existingBooks = []) {
            const newBookRef = cache.writeQuery({
              data: addBook,
              query: ALL_BOOKS,
            })
            return [...existingBooks, newBookRef]
          },
        },
      })
    },
    onCompleted: () => {
      toast({
        title: 'Book Added.',
        description: 'Book added with success!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    },
  })

  const handleAdd = async () => {
    await addBook({
      variables: {
        readState: 'unread',
        title: book.title,
        id: book.id,
        published: book.published,
        author: book.author[0],
        genres: book.genres,
        cover: book.cover,
        pages: book.pages,
      },
    })
  }

  return (
    <VStack bg={lowerBoxBackground} w='full' pb={8} px={12}>
      <Text alignSelf='flex-start' fontSize='lg' fontWeight='bold'>
        Description
      </Text>
      <Box
        px={4}
        textAlign='left'
        overflowY='scroll'
        h={120}
        w='full'
        className='book-description'
        dangerouslySetInnerHTML={{ __html: book.description }}
      />
      <HStack pt={4}>
        <ButtonGroup variant='ghost' colorScheme='teal'>
          <IconButton
            fontSize='xl'
            icon={<Icon as={BsBookmarkFill} />}
            onClick={handleAdd}
            _hover={{
              bg: useColorModeValue('teal.100', 'teal.900'),
            }}
          />
        </ButtonGroup>
      </HStack>
    </VStack>
  )
}

export default BookLowerBox
