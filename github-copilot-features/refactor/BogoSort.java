// performance improvement
// This is a simple implementation of BogoSort, which is a highly inefficient sorting algorithm.
// It is not recommended for practical use, but it serves as an example of a sorting algorithm.
// BogoSort repeatedly shuffles the array until it is sorted.

import java.util.Arrays;
import java.util.Random;

public class BogoSort {
    private static boolean isSorted(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    private static void shuffle(int[] arr) {
        Random rand = new Random();
        for (int i = 0; i < arr.length; i++) {
            int randomIndex = rand.nextInt(arr.length);
            int temp = arr[i];
            arr[i] = arr[randomIndex];
            arr[randomIndex] = temp;
        }
    }

    public static void bogoSort(int[] arr) {
        while (!isSorted(arr)) {
            shuffle(arr);
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 2, 4, 1};
        System.out.println("Before sorting: " + Arrays.toString(arr));
        bogoSort(arr);
        System.out.println("After sorting: " + Arrays.toString(arr));
    }
}