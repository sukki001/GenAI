#include <iostream>
#include <conio.h>
#include <windows.h>
using namespace std;

bool gameOver;
const int width = 40;
const int height = 20;
int x, y, fruitX, fruitY, score;
int tailX[100], tailY[100];
int nTail;
enum eDirection { STOP = 0, LEFT, RIGHT, UP, DOWN };
eDirection dir;

void SetCursorPosition(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

void HideCursor() {
    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursorInfo);
    cursorInfo.bVisible = false;
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursorInfo);
}

void Setup() {
    gameOver = false;
    dir = STOP;
    x = width / 2;
    y = height / 2;
    fruitX = rand() % width;
    fruitY = rand() % height;
    score = 0;
    nTail = 0;
    HideCursor();
}

void DrawInitialBorder() {
    // Top wall
    for (int i = 0; i < width + 2; i++)
        cout << "#";
    cout << endl;

    // Game area with side walls
    for (int i = 0; i < height; i++) {
        cout << "#";
        for (int j = 0; j < width; j++)
            cout << " ";
        cout << "#" << endl;
    }

    // Bottom wall
    for (int i = 0; i < width + 2; i++)
        cout << "#";
    cout << endl;
    
    cout << "Score: 0" << endl;
    cout << "Controls: W=Up, A=Left, S=Down, D=Right, X=Exit" << endl;
}

void Draw() {
    // Clear previous snake position
    static int prevX = -1, prevY = -1;
    static int prevTailX[100], prevTailY[100];
    static int prevNTail = 0;
    
    if (prevX != -1) {
        SetCursorPosition(prevX + 1, prevY + 1);
        cout << " ";
    }
    
    for (int i = 0; i < prevNTail; i++) {
        SetCursorPosition(prevTailX[i] + 1, prevTailY[i] + 1);
        cout << " ";
    }
    
    // Draw fruit
    SetCursorPosition(fruitX + 1, fruitY + 1);
    cout << "F";
    
    // Draw snake head
    SetCursorPosition(x + 1, y + 1);
    cout << "O";
    
    // Draw snake tail
    for (int i = 0; i < nTail; i++) {
        SetCursorPosition(tailX[i] + 1, tailY[i] + 1);
        cout << "o";
    }
    
    // Update score
    SetCursorPosition(7, height + 2);
    cout << score << "   ";
    
    // Store current positions for next frame
    prevX = x;
    prevY = y;
    prevNTail = nTail;
    for (int i = 0; i < nTail; i++) {
        prevTailX[i] = tailX[i];
        prevTailY[i] = tailY[i];
    }
    
    // Reset cursor to bottom
    SetCursorPosition(0, height + 4);
}

void Input() {
    if (_kbhit()) {
        switch (_getch()) {
            case 'a':
            case 'A':
                if (dir != RIGHT) dir = LEFT;
                break;
            case 'd':
            case 'D':
                if (dir != LEFT) dir = RIGHT;
                break;
            case 'w':
            case 'W':
                if (dir != DOWN) dir = UP;
                break;
            case 's':
            case 'S':
                if (dir != UP) dir = DOWN;
                break;
            case 'x':
            case 'X':
                gameOver = true;
                break;
        }
    }
}

void Logic() {
    int prevX = tailX[0];
    int prevY = tailY[0];
    int prev2X, prev2Y;
    tailX[0] = x;
    tailY[0] = y;
    
    for (int i = 1; i < nTail; i++) {
        prev2X = tailX[i];
        prev2Y = tailY[i];
        tailX[i] = prevX;
        tailY[i] = prevY;
        prevX = prev2X;
        prevY = prev2Y;
    }

    switch (dir) {
        case LEFT:
            x--;
            break;
        case RIGHT:
            x++;
            break;
        case UP:
            y--;
            break;
        case DOWN:
            y++;
            break;
        default:
            break;
    }

    // Wall collision
    if (x >= width) x = 0; else if (x < 0) x = width - 1;
    if (y >= height) y = 0; else if (y < 0) y = height - 1;

    // Tail collision
    for (int i = 0; i < nTail; i++) {
        if (tailX[i] == x && tailY[i] == y)
            gameOver = true;
    }

    // Fruit collision
    if (x == fruitX && y == fruitY) {
        score += 10;
        fruitX = rand() % width;
        fruitY = rand() % height;
        nTail++;
    }
}

int main() {
    Setup();
    DrawInitialBorder();
    
    while (!gameOver) {
        Draw();
        Input();
        Logic();
        Sleep(100);
    }
    
    SetCursorPosition(0, height + 5);
    cout << "\nGame Over! Final Score: " << score << endl;
    
    return 0;
}